// Goal: Move all zeros to the end of the array in-place, preserving
// the relative order of non-zero elements.
//
// Modify nums in-place. Return nothing.
//
// Example:
//   moveZeros([0, 1, 0, 3, 12]) -> nums becomes [1, 3, 12, 0, 0]
//   moveZeros([0, 0, 1])        -> nums becomes [1, 0, 0]
function moveZeros(nums: number[]): void {
  throw new Error('not implemented');
}

// ---Tests
test('moves zeros to the end', () => {
  const nums = [0, 1, 0, 3, 12];
  moveZeros(nums);
  return nums;
}, [1, 3, 12, 0, 0]);
test('handles leading zeros', () => {
  const nums = [0, 0, 1];
  moveZeros(nums);
  return nums;
}, [1, 0, 0]);
test('no zeros to move', () => {
  const nums = [1, 2, 3];
  moveZeros(nums);
  return nums;
}, [1, 2, 3]);
test('all zeros', () => {
  const nums = [0, 0, 0];
  moveZeros(nums);
  return nums;
}, [0, 0, 0]);
test('single zero', () => {
  const nums = [0];
  moveZeros(nums);
  return nums;
}, [0]);
test('empty array', () => {
  const nums: number[] = [];
  moveZeros(nums);
  return nums;
}, []);
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
