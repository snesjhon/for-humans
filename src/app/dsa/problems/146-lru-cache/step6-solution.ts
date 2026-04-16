// Goal: Finish put by evicting the coldest box whenever the shelf overflows.

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

  put(key: number, value: number): void {
    const existingBox = this.boxesByLabel.get(key);

    if (existingBox) {
      existingBox.value = value;
      this.removeBox(existingBox);
      this.addBoxToHotShelf(existingBox);
      return;
    }

    const freshBox = new ShelfNode(key, value);
    this.boxesByLabel.set(key, freshBox);
    this.addBoxToHotShelf(freshBox);

    if (this.boxesByLabel.size > this.capacity) {
      const coldestBox = this.coldGate.warmer!;
      this.boxesByLabel.delete(coldestBox.key);
      this.removeBox(coldestBox);
    }
  }
}

runCase('put stores a new label so it can be read back later', () => {
  const cache = new LRUCache(2);
  cache.put(1, 10);
  return cache.get(1);
}, 10);

runCase('put on an existing label updates the value and keeps it hot', () => {
  const cache = new LRUCache(2);
  cache.put(1, 10);
  cache.put(2, 20);
  cache.put(1, 15);
  cache.put(3, 30);
  return [cache.get(1), cache.get(2), cache.get(3)];
}, [15, -1, 30]);

runCase('overflow evicts the coldest untouched box', () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.get(1);
  cache.put(3, 3);
  return [cache.get(1), cache.get(2), cache.get(3)];
}, [1, -1, 3]);

function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
