// Goal: Set the live trail boundaries and return immediately when that
//       window is already sorted from left to right.

function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  if (nums[left] <= nums[right]) {
    return nums[left];
  }

  return nums[left];
}

// ---Tests
runCase('single point is already the minimum', () => findMin([7]), 7);
runCase('already sorted trail returns the first point', () => findMin([11, 13, 15, 17]), 11);
runCase('two-point sorted trail returns the leftmost value', () => findMin([2, 5]), 2);
runCase('sorted negative trail still returns the first value', () => findMin([-9, -4, -1]), -9);
// ---End Tests

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
