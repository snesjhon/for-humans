// Goal: Add the insertion move so a new or reheated box clips in right after
// the hot gate.

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
    throw new Error('not implemented');
  }
}

runCase('addBoxToHotShelf clips the first box between the gates', () => {
  const cache = new LRUCache(2) as any;
  const box = new ShelfNode(1, 10);
  cache.addBoxToHotShelf(box);
  return snapshot(cache);
}, ['HOT', '1:10', 'COLD']);

runCase('new hot boxes always insert right after the hot gate', () => {
  const cache = new LRUCache(2) as any;
  const first = new ShelfNode(1, 10);
  const second = new ShelfNode(2, 20);
  cache.addBoxToHotShelf(first);
  cache.addBoxToHotShelf(second);
  return snapshot(cache);
}, ['HOT', '2:20', '1:10', 'COLD']);

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
