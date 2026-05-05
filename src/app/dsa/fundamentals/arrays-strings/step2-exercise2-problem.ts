// Goal: Remove duplicates from a sorted array in-place using the write cursor.
//
// Modify nums so each unique value appears exactly once at the front.
// Return the count of unique values.
// Elements beyond the returned count may hold any value.
//
// Example:
//   removeDuplicates([1, 1, 2])          -> 2  (nums becomes [1, 2, _])
//   removeDuplicates([0, 0, 1, 1, 2, 3]) -> 4  (nums becomes [0, 1, 2, 3, _, _])
function removeDuplicates(nums: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('removes one duplicate', () => {
  const nums = [1, 1, 2];
  const k = removeDuplicates(nums);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([1, 2]));
test('removes multiple clusters of duplicates', () => {
  const nums = [0, 0, 1, 1, 2, 3];
  const k = removeDuplicates(nums);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([0, 1, 2, 3]));
test('handles no duplicates', () => {
  const nums = [1, 2, 3];
  const k = removeDuplicates(nums);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([1, 2, 3]));
test('all elements the same', () => {
  const nums = [7, 7, 7, 7];
  const k = removeDuplicates(nums);
  return JSON.stringify(nums.slice(0, k));
}, JSON.stringify([7]));
test('single element', () => {
  const nums = [4];
  const k = removeDuplicates(nums);
  return k;
}, 1);
test('empty array', () => {
  const nums: number[] = [];
  const k = removeDuplicates(nums);
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
