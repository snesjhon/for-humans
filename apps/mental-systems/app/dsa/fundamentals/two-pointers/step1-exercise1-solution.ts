// =============================================================================
// Two Pointers — Level 1, Exercise 1: Do the Inspectors Find Their Match? — SOLUTION
// =============================================================================
// Goal: Practice the core sorted-array two-pointer decision loop.
//
// Left inspector steps right when the sum is too small (need a larger partner).
// Right inspector steps left when the sum is too large (need a smaller partner).
// Each move eliminates one element from further consideration.
// =============================================================================
function hasPairWithSum(nums: number[], target: number): boolean {
  let L = 0, R = nums.length - 1;
  while (L < R) {
    const sum = nums[L] + nums[R];
    if (sum === target) return true;
    else if (sum < target) L++;
    else R--;
  }
  return false;
}

test('pair exists at ends',     () => hasPairWithSum([1, 2, 3, 5, 7], 9),   true);
test('no valid pair',           () => hasPairWithSum([1, 2, 3, 5, 7], 13),  false);
test('pair in the middle',      () => hasPairWithSum([1, 4, 6, 9, 11], 15), true);
test('empty array',             () => hasPairWithSum([], 5),                false);
test('single element',          () => hasPairWithSum([5], 10),              false);
test('negative numbers',        () => hasPairWithSum([-3, 0, 3, 7], 0),    true);

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
    } else { throw e; }
  }
}
