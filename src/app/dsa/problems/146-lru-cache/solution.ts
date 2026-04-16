// =============================================================================
// 146. LRU Cache — Complete Solution
// =============================================================================

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
    this.hotGate.colder = this.coldGate; // hot gate opens straight toward the shelf
    this.coldGate.warmer = this.hotGate; // cold gate closes the other end
  }

  private removeBox(box: ShelfNode): void {
    const warmerBox = box.warmer!; // the warmer neighbor is closer to the hot gate
    const colderBox = box.colder!; // the colder neighbor is closer to eviction
    warmerBox.colder = colderBox; // clip the warmer neighbor past this box
    colderBox.warmer = warmerBox; // clip the colder neighbor back to the warmer one
  }

  private addBoxToHotShelf(box: ShelfNode): void {
    const firstWarmBox = this.hotGate.colder!; // whatever sits after the hot gate is currently hottest
    box.warmer = this.hotGate; // new or reheated box snaps right beside the foreman
    box.colder = firstWarmBox; // its colder neighbor becomes the old hottest box
    this.hotGate.colder = box; // hot gate now points to this fresh hot box
    firstWarmBox.warmer = box; // the old hottest box now sits just behind it
  }

  get(key: number): number {
    const box = this.boxesByLabel.get(key); // consult the ledger for the exact shelf node
    if (!box) return -1; // no label means no box in the cache

    this.removeBox(box); // touched box leaves its old shelf position
    this.addBoxToHotShelf(box); // every successful touch reheats the box
    return box.value; // return the contents after restoring recency order
  }

  put(key: number, value: number): void {
    const existingBox = this.boxesByLabel.get(key); // check whether this label already owns a box

    if (existingBox) {
      existingBox.value = value; // rewrite the current box contents
      this.removeBox(existingBox); // detach it from its old place in the heat order
      this.addBoxToHotShelf(existingBox); // updated boxes become hottest immediately
      return;
    }

    const freshBox = new ShelfNode(key, value); // assemble a brand-new box for the arriving label
    this.boxesByLabel.set(key, freshBox); // ledger now points directly to the new node
    this.addBoxToHotShelf(freshBox); // brand-new arrivals start at the hot end

    if (this.boxesByLabel.size > this.capacity) {
      const coldestBox = this.coldGate.warmer!; // the box before the cold gate is least recently used
      this.boxesByLabel.delete(coldestBox.key); // erase the cold label from the ledger
      this.removeBox(coldestBox); // physically lift the cold box off the shelf
    }
  }
}

runCase('example sequence from the prompt', () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  const firstRead = cache.get(1);
  cache.put(3, 3);
  const secondRead = cache.get(2);
  cache.put(4, 4);
  return [firstRead, secondRead, cache.get(1), cache.get(3), cache.get(4)];
}, [1, -1, -1, 3, 4]);

runCase('updating an existing label keeps it hot', () => {
  const cache = new LRUCache(2);
  cache.put(2, 1);
  cache.put(2, 2);
  cache.put(1, 1);
  cache.put(4, 1);
  return [cache.get(2), cache.get(1), cache.get(4)];
}, [-1, 1, 1]);

runCase('a get can change the later eviction target', () => {
  const cache = new LRUCache(2);
  cache.put(1, 10);
  cache.put(2, 20);
  cache.get(1);
  cache.put(3, 30);
  return [cache.get(1), cache.get(2), cache.get(3)];
}, [10, -1, 30]);

runCase('single-slot shelf always keeps only the hottest box', () => {
  const cache = new LRUCache(1);
  cache.put(7, 70);
  cache.put(8, 80);
  return [cache.get(7), cache.get(8)];
}, [-1, 80]);

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
