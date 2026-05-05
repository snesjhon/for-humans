// Goal: Build a running-maximum array using a single pass.
//
// Return a new array of the same length where each element at index i
// equals the maximum value seen in nums[0] through nums[i].
//
// Example:
//   runningMax([3, 1, 4, 1, 5, 9, 2]) -> [3, 3, 4, 4, 5, 9, 9]
//   runningMax([5, 4, 3, 2, 1])       -> [5, 5, 5, 5, 5]
function runningMax(nums: number[]): number[] {
  const result: number[] = [];
  let max = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > max) max = nums[i];
    result.push(max);
  }
  return result;
}

// ---Tests
test('tracks maximum through rises and falls', () => runningMax([3, 1, 4, 1, 5, 9, 2]), [3, 3, 4, 4, 5, 9, 9]);
test('all elements descending', () => runningMax([5, 4, 3, 2, 1]), [5, 5, 5, 5, 5]);
test('all elements ascending', () => runningMax([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
test('single element', () => runningMax([42]), [42]);
test('empty array', () => runningMax([]), []);
test('handles negative values', () => runningMax([-5, -3, -8, -1]), [-5, -3, -3, -1]);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
