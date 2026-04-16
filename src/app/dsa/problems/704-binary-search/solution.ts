// Goal: Use Binary Search to keep a live range of possible answers and return
//       the target index in O(log n), or -1 if the target is missing.

function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// ---Tests
runCase('example 1: target exists', () => search([-1, 0, 3, 5, 9, 12], 9), 4);
runCase('example 2: target is missing', () => search([-1, 0, 3, 5, 9, 12], 2), -1);
runCase('finds the leftmost value', () => search([-5, -1, 2, 6, 8], -5), 0);
runCase('finds the rightmost value', () => search([-5, -1, 2, 6, 8], 8), 4);
runCase('handles a single-element hit', () => search([4], 4), 0);
runCase('handles a single-element miss', () => search([4], 1), -1);
runCase('handles an empty array', () => search([], 1), -1);
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
