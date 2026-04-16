// Goal: Add the removal move so one box can leave the shelf and its warmer
// and colder neighbors reconnect directly.

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
    throw new Error('not implemented');
  }
}

runCase('removeBox reconnects the gates when the only real box leaves', () => {
  const cache = new LRUCache(2) as any;
  const box = new ShelfNode(1, 10);
  cache.hotGate.colder = box;
  box.warmer = cache.hotGate;
  box.colder = cache.coldGate;
  cache.coldGate.warmer = box;

  cache.removeBox(box);

  return snapshot(cache);
}, ['HOT', 'COLD']);

runCase('removeBox reconnects warmer and colder real neighbors', () => {
  const cache = new LRUCache(3) as any;
  const first = new ShelfNode(1, 10);
  const middle = new ShelfNode(2, 20);
  const last = new ShelfNode(3, 30);

  cache.hotGate.colder = first;
  first.warmer = cache.hotGate;
  first.colder = middle;
  middle.warmer = first;
  middle.colder = last;
  last.warmer = middle;
  last.colder = cache.coldGate;
  cache.coldGate.warmer = last;

  cache.removeBox(middle);

  return snapshot(cache);
}, ['HOT', '1:10', '3:30', 'COLD']);

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
