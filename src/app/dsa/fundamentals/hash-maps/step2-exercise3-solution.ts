// Goal: Use a logbook (hash set) to find elements that exist in `a` but NOT
//       in `b` — the set difference — without nested scanning.
function setDifference(a: number[], b: number[]): number[] {
  const setB = new Set(b);
  const result = new Set(a.filter((x) => !setB.has(x)));
  return [...result].sort((x, y) => x - y);
}

// ---Tests
test('basic', () => setDifference([1, 2, 3], [2]), [1, 3]);
test('duplicates in a', () => setDifference([1, 2, 2, 3], [2, 3]), [1]);
test('all removed', () => setDifference([1, 2, 3], [1, 2, 3]), []);
test('none removed', () => setDifference([1, 2, 3], []), [1, 2, 3]);
test('empty a', () => setDifference([], [1, 2]), []);
test('b has extras', () => setDifference([3, 1, 2], [5, 1]), [2, 3]);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
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
