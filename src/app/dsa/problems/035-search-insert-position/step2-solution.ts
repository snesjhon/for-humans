// Goal: Keep shrinking toward the first index whose value is at least the
//       target, or fall back to nums.length when every value is too small.

function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let answer = nums.length;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] >= target) {
      answer = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return answer;
}

// ---Tests
runCase('example 1: exact hit returns its index', () => searchInsert([1, 3, 5, 6], 5), 2);
runCase('example 2: target fits between two values', () => searchInsert([1, 3, 5, 6], 2), 1);
runCase('example 3: target inserts at the end', () => searchInsert([1, 3, 5, 6], 7), 4);
runCase('example 4: target inserts at the beginning', () => searchInsert([1, 3, 5, 6], 0), 0);
runCase('single element can still insert after the end', () => searchInsert([4], 9), 1);
runCase('empty array still returns index 0', () => searchInsert([], 9), 0);
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
