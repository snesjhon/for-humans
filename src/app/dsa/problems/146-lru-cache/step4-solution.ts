// Goal: Build get so the ledger can find a box in O(1) and every successful
// read reheats that box onto the hot end.

// ---Helpers

class ShelfNode {
  key: number;
  value: number;
  warmer: ShelfNode | null = null;
  colder: ShelfNode | null = null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
  }
}

// ---End Helpers

class LRUCache {
  private readonly capacity: number;
  private readonly boxesByLabel = new Map<number, ShelfNode>();
  private readonly hotGate = new ShelfNode(-1, -1);
  private readonly coldGate = new ShelfNode(-1, -1);

  constructor(capacity: number) {
    this.capacity = capacity;
    this.hotGate.colder = this.coldGate;
    this.coldGate.warmer = this.hotGate;
  }

  private removeBox(box: ShelfNode): void {
    const warmerBox = box.warmer!;
    const colderBox = box.colder!;
    warmerBox.colder = colderBox;
    colderBox.warmer = warmerBox;
  }

  private addBoxToHotShelf(box: ShelfNode): void {
    const firstWarmBox = this.hotGate.colder!;
    box.warmer = this.hotGate;
    box.colder = firstWarmBox;
    this.hotGate.colder = box;
    firstWarmBox.warmer = box;
  }

  get(key: number): number {
    const box = this.boxesByLabel.get(key);
    if (!box) return -1;

    this.removeBox(box);
    this.addBoxToHotShelf(box);
    return box.value;
  }
}

runCase('missing label returns -1', () => {
  const cache = new LRUCache(2);
  return cache.get(99);
}, -1);

runCase('successful get returns the value for that label', () => {
  const cache = new LRUCache(2) as any;
  const box = new ShelfNode(1, 10);
  cache.boxesByLabel.set(1, box);
  cache.addBoxToHotShelf(box);
  return cache.get(1);
}, 10);

runCase('successful get reheats the box onto the hot end', () => {
  const cache = new LRUCache(2) as any;
  const older = new ShelfNode(1, 10);
  const newer = new ShelfNode(2, 20);
  cache.boxesByLabel.set(1, older);
  cache.boxesByLabel.set(2, newer);
  cache.addBoxToHotShelf(older);
  cache.addBoxToHotShelf(newer);

  cache.get(older.key);

  return snapshot(cache);
}, ['HOT', '1:10', '2:20', 'COLD']);

function snapshot(cache: any): string[] {
  const labels: string[] = ['HOT'];
  let node = cache.hotGate.colder;

  while (node && node !== cache.coldGate) {
    labels.push(`${node.key}:${node.value}`);
    node = node.colder;
  }

  labels.push('COLD');
  return labels;
}

function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw e;
    }
  }
}
