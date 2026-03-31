// =============================================================================
// Hash Maps & Sets — Level 1, Exercise 3: Check the Catalog for a Matching Pair
// =============================================================================
// Goal: Use a catalog (value → index) to find a complementary pair in one pass
//       without scanning backwards.
//
// Given an array and a target, return true if any two elements at DIFFERENT
// indices sum to the target. Return false otherwise.
//
// Example:
//   hasPairWithSum([2, 7, 11, 15], 9)  → true   (2 + 7)
//   hasPairWithSum([1, 2, 3], 7)       → false
//   hasPairWithSum([3, 3], 6)          → true    (3 at index 0, 3 at index 1)
//   hasPairWithSum([5], 10)            → false   (only one element)
// =============================================================================
function hasPairWithSum(nums: number[], target: number): boolean {
  throw new Error('not implemented');
}

test('basic pair found', () => hasPairWithSum([2, 7, 11, 15], 9), true);
test('no pair', () => hasPairWithSum([1, 2, 3], 7), false);
test('same value at two indices', () => hasPairWithSum([3, 3], 6), true);
test('single element', () => hasPairWithSum([5], 10), false);
test('empty', () => hasPairWithSum([], 0), false);
test('pair at end', () => hasPairWithSum([4, 1, 9, 6], 10), true);

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
    } else {
      throw e;
    }
  }
}
