// Goal: Return the first index whose value is at least the target, or
//       nums.length if the target belongs after every existing value.

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
runCase('returns the first equal value in a larger sorted rail', () => searchInsert([1, 4, 6, 8, 10, 13], 8), 3);
runCase('returns nums.length when target is larger than all values', () => searchInsert([2, 5, 9], 12), 3);
runCase('returns 0 for an empty array', () => searchInsert([], 12), 0);
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
