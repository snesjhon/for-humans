// Goal: Set a fallback insertion slot at the end, probe the midpoint, and
//       return immediately when that first probe is already a valid slot.

function searchInsert(nums: number[], target: number): number {
  throw new Error('not implemented');
}

// ---Tests
runCase('empty array inserts at index 0', () => searchInsert([], 5), 0);
runCase('single value can insert before the first element', () => searchInsert([7], 3), 0);
runCase('single value can insert after the last element', () => searchInsert([7], 10), 1);
runCase('odd-length array can certify the first midpoint as the slot', () => searchInsert([1, 3, 5, 7, 9], 4), 2);
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
