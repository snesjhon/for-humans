// Goal: Use a logbook (hash set) to count how many distinct values are present
//       in a single pass.
//
// Return the number of unique elements in the array.
//
// Example:
//   countUnique([1, 2, 2, 3, 3, 3])  → 3
//   countUnique([5, 5, 5])           → 1
//   countUnique([1, 2, 3])           → 3
//   countUnique([])                  → 0
function countUnique(nums: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty', () => countUnique([]), 0);
test('single', () => countUnique([42]), 1);
test('all same', () => countUnique([5, 5, 5]), 1);
test('all different', () => countUnique([1, 2, 3]), 3);
test('mixed', () => countUnique([1, 2, 2, 3, 3, 3]), 3);
test('negatives', () => countUnique([-1, -1, 0, 1, 1]), 3);
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
