// Goal: Find two numbers in a sorted array that sum to a target using two pointers.
//
// Return the 1-based indices [left+1, right+1] of the two numbers.
// You may not use the same element twice.
// Exactly one solution is guaranteed.
//
// Example:
//   twoSumSorted([2, 7, 11, 15], 9) -> [1, 2]
//   twoSumSorted([2, 3, 4], 6)      -> [1, 3]
function twoSumSorted(numbers: number[], target: number): [number, number] {
  throw new Error('not implemented');
}

// ---Tests
test('finds pair at the ends', () => twoSumSorted([2, 7, 11, 15], 9), [1, 2]);
test('finds pair spanning the array', () => twoSumSorted([2, 3, 4], 6), [1, 3]);
test('finds pair near the end', () => twoSumSorted([1, 2, 3, 4, 5], 9), [4, 5]);
test('handles two-element array', () => twoSumSorted([1, 3], 4), [1, 2]);
test('works with negative numbers', () => twoSumSorted([-4, -1, 0, 3, 5], -1), [1, 4]);
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
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers
