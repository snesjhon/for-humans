// Goal: Build a prefix sum array using a single pass.
//
// Return a new array of the same length where each element at index i
// equals the sum of nums[0] through nums[i].
//
// Example:
//   prefixSums([3, 1, 4, 1, 5]) -> [3, 4, 8, 9, 14]
//   prefixSums([1, 2, 3])       -> [1, 3, 6]
function prefixSums(nums: number[]): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('builds prefix sums for a general array', () => prefixSums([3, 1, 4, 1, 5]), [3, 4, 8, 9, 14]);
test('handles a simple ascending sequence', () => prefixSums([1, 2, 3]), [1, 3, 6]);
test('handles a single element', () => prefixSums([7]), [7]);
test('handles an empty array', () => prefixSums([]), []);
test('handles negative numbers', () => prefixSums([-1, 2, -3, 4]), [-1, 1, -2, 2]);
test('handles all zeros', () => prefixSums([0, 0, 0]), [0, 0, 0]);
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
