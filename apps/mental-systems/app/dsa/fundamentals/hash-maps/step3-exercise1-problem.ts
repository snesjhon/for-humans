// =============================================================================
// Hash Maps & Sets — Level 3, Exercise 1: Did Any Tally Reset to Zero?
// =============================================================================
// Goal: Use a running tally + logbook to detect whether any contiguous subarray
//       sums to exactly zero — in a single pass.
//
// Return true if any contiguous subarray (at least one element) sums to zero.
//
// How the tally works: if the running sum ever equals a value you've seen before,
// the elements between that earlier checkpoint and now sum to zero.
// Don't forget to seed the logbook with 0 before you start.
//
// Example:
//   hasZeroSumSubarray([1, -1, 2])    → true   ([1,-1] sums to 0)
//   hasZeroSumSubarray([0])           → true   ([0] sums to 0)
//   hasZeroSumSubarray([1, 2, 3])     → false
//   hasZeroSumSubarray([3, 1, -4, 2]) → true   ([3,1,-4] sums to 0)
// =============================================================================
function hasZeroSumSubarray(nums: number[]): boolean {
  throw new Error('not implemented');
}

test('false: positive only', () => hasZeroSumSubarray([1, 2, 3]), false);
test('true: zero element', () => hasZeroSumSubarray([0]), true);
test('true: pair cancels', () => hasZeroSumSubarray([1, -1, 2]), true);
test('true: triple sums to zero', () => hasZeroSumSubarray([3, 1, -4, 2]), true);
test('true: whole array', () => hasZeroSumSubarray([1, 2, -3]), true);
test('false: partial negatives', () => hasZeroSumSubarray([4, -1, 3]), false);

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
