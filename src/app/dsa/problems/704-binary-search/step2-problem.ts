// Goal: Keep shrinking the live range left or right until the target is found
//       or the clamps cross.

function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    throw new Error('not implemented');
  }

  return -1;
}

// ---Tests
runCase('empty rail has no target', () => search([], 4), -1);
runCase('single mark matches immediately', () => search([7], 7), 0);
runCase('single mark can miss immediately', () => search([7], 3), -1);
runCase('finds the target after discarding the left half', () => search([-1, 0, 3, 5, 9, 12], 9), 4);
runCase('finds the target after discarding the right half', () => search([-1, 0, 3, 5, 9, 12], 0), 1);
runCase('returns -1 after the live range is exhausted', () => search([-1, 0, 3, 5, 9, 12], 2), -1);
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
