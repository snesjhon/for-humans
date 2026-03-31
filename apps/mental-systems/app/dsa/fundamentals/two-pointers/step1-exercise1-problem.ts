// =============================================================================
// Two Pointers — Level 1, Exercise 1: Do the Inspectors Find Their Match?
// =============================================================================
// Goal: Practice the core sorted-array two-pointer decision loop.
//
// Two inspectors stand at opposite ends of a sorted measurement lane.
// At each step they compare the sum of their readings against a target.
// The left inspector steps right when the sum is too small.
// The right inspector steps left when the sum is too large.
// They stop the moment they find a pair that hits the target exactly.
//
// Return true if any two distinct elements sum to target, false otherwise.
//
// Example:
//   hasPairWithSum([1, 2, 3, 5, 7], 9)  → true  (2 + 7 = 9)
//   hasPairWithSum([1, 2, 3, 5, 7], 13) → false  (no pair reaches 13)
// =============================================================================
function hasPairWithSum(nums: number[], target: number): boolean {
  throw new Error('not implemented');
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
