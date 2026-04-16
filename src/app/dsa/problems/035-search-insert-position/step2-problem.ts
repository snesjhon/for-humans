// Goal: Keep shrinking toward the first index whose value is at least the
//       target, or fall back to nums.length when every value is too small.

function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let answer = nums.length;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] >= target) {
      return mid;
    }

    throw new Error('not implemented');
  }

  return answer;
}

// ---Tests
runCase('empty array still returns index 0', () => searchInsert([], 9), 0);
runCase('first midpoint can still certify a valid slot immediately', () => searchInsert([1, 3, 5, 7, 9], 4), 2);
runCase('exact hit can require more rightward searching before certification', () => searchInsert([1, 3, 5, 6], 5), 2);
runCase('target larger than the midpoint must keep searching right', () => searchInsert([1, 3, 5, 6], 7), 4);
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
