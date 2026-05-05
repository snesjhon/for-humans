// Goal: Remove all occurrences of a target value in-place using the write cursor.
//
// Modify nums so all non-target values appear at the front in their original
// relative order. Return the count of kept elements.
// Elements beyond the returned count may hold any value.
//
// Example:
//   removeValue([3, 2, 2, 3], 3)    -> 2  (nums becomes [2, 2, _, _])
//   removeValue([0, 1, 2, 2, 3], 2) -> 3  (nums becomes [0, 1, 3, _, _])
function removeValue(nums: number[], target: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('removes a value that appears twice', () => {
  const nums = [3, 2, 2, 3];
  const k = removeValue(nums, 3);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([2, 2]));
test('removes a value in the middle', () => {
  const nums = [0, 1, 2, 2, 3];
  const k = removeValue(nums, 2);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([0, 1, 3]));
test('removes nothing when target is absent', () => {
  const nums = [1, 2, 3];
  const k = removeValue(nums, 9);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([1, 2, 3]));
test('removes everything when all elements match', () => {
  const nums = [5, 5, 5];
  const k = removeValue(nums, 5);
  return k;
}, 0);
test('handles empty array', () => {
  const nums: number[] = [];
  const k = removeValue(nums, 1);
  return k;
}, 0);
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
