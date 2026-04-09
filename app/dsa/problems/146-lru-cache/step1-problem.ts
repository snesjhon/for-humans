// Goal: Build the shelf box and the empty cache scaffold so the workshop has
// a ledger(boxesByLabel), a hotGate, a coldGate, and open space between them.

class ShelfNode {
  constructor(key: number, value: number) {
    throw new Error('not implemented');
  }
}

class LRUCache {
  constructor(capacity: number) {
    throw new Error('not implemented');
  }
}

// ---Tests
runCase(
  'constructor stores the key and value on a shelf box',
  () => {
    const box = new ShelfNode(7, 70);
    return [box.key, box.value];
  },
  [7, 70],
);

runCase(
  'new boxes start detached from any neighbors',
  () => {
    const box = new ShelfNode(7, 70);
    return [box.warmer, box.colder];
  },
  [null, null],
);

runCase(
  'cache stores the declared capacity',
  () => {
    const cache = new LRUCache(3) as any;
    return cache.capacity;
  },
  3,
);

runCase(
  'empty shelf starts with hot gate connected to cold gate',
  () => {
    const cache = new LRUCache(2) as any;
    return [
      cache.hotGate.colder === cache.coldGate,
      cache.coldGate.warmer === cache.hotGate,
    ];
  },
  [true, true],
);

runCase(
  'ledger starts empty before any real boxes arrive',
  () => {
    const cache = new LRUCache(5) as any;
    return cache.boxesByLabel.size;
  },
  0,
);

// ---End Tests

// ---Helpers

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
// ---EndHelpers
