// Goal: Practice binary branching that accumulates a count instead of collecting routes.
//
// At each junction fork into two recursive calls: one includes nums[i] (running
// sum increases), one skips it (running sum unchanged). Return the total number of
// routes where the final sum exactly equals target. Pass the running sum as a
// parameter — no need to inspect a pack array at the base.
//
// Example:
//   countTargetSubsets([1, 2, 3], 3)  → 2  ({1,2} and {3})
//   countTargetSubsets([1, 2, 3], 0)  → 1  (empty set)

function countTargetSubsets(nums: number[], target: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty range hits zero', () => countTargetSubsets([], 0), 1);
test('empty range misses nonzero', () => countTargetSubsets([], 5), 0);
test('single match', () => countTargetSubsets([5], 5), 1);
test('single miss', () => countTargetSubsets([5], 3), 0);
test('two paths to target', () => countTargetSubsets([1, 2, 3], 3), 2);
test('full set only', () => countTargetSubsets([1, 2, 3], 6), 1);
test('impossible target', () => countTargetSubsets([1, 2, 3], 10), 0);
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
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw e;
    }
  }
}
// ---End Helpers
