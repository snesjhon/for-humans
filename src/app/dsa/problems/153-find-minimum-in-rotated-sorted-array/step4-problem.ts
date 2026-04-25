// Goal: Add the second Binary Search decision so the search keeps the lower
//       valley alive when the midpoint is not larger than the right anchor.

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
    } else {
      throw new Error('not implemented');
    }
  }

  return nums[left];
}

// ---Tests
runCase('single point is already the minimum', () => findMin([7]), 7);
runCase('already sorted trail returns the first point', () => findMin([11, 13, 15, 17]), 11);
runCase('rotation near the end keeps discarding the high ridge', () => findMin([2, 3, 4, 5, 1]), 1);
runCase('example 1: pivot in the middle uses both rules', () => findMin([3, 4, 5, 1, 2]), 1);
runCase('example 2: pivot near the end uses both rules', () => findMin([4, 5, 6, 7, 0, 1, 2]), 0);
runCase('rotation near the front still finds the minimum', () => findMin([5, 1, 2, 3, 4]), 1);
runCase('handles negative values across the drop', () => findMin([2, 4, -9, -7, -3, 0]), -9);
// ---End Tests

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
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
// ---End Helpers
