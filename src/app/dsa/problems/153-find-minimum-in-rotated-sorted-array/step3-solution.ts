// Goal: Add the first Binary Search decision by discarding the higher ridge
//       when the midpoint is larger than the right anchor.

function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  if (nums[left] <= nums[right]) {
    return nums[left];
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
      return left;
    } else {
      throw new Error('not implemented');
    }
  }

  throw new Error('not implemented');
}

// ---Tests
runCase('single point is already the minimum', () => findMin([7]), 7);
runCase('already sorted trail returns the first point', () => findMin([11, 13, 15, 17]), 11);
runCase('high-ridge probe moves the left boundary to index 3', () => findMin([2, 3, 4, 5, 1]), 3);
runCase('high-ridge discard can move the left boundary deep into the array', () => findMin([10, 20, 30, 40, 50, 60, 5]), 4);
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
