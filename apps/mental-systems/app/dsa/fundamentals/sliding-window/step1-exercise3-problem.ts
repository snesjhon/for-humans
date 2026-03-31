// =============================================================================
// Sliding Window — Level 1, Exercise 3: Hit Target in k Chapters
// =============================================================================
// Goal: Practice fixed-size window slide checking an exact condition per window.
//
// The historian wants to know whether any k-chapter frame has a total
// word count that hits the target exactly. Slide the fixed frame and
// check the sum at each position.
//
// Return true if any window of exactly k consecutive elements sums to target.
// Return false otherwise. Return false if k > nums.length.
//
// Example:
//   windowHasSum([1, 4, 2, 5, 3], 3, 11) → true   (window [4,2,5] = 11)
//   windowHasSum([1, 4, 2, 5, 3], 3, 15) → false  (no window sums to 15)
// =============================================================================
function windowHasSum(nums: number[], k: number, target: number): boolean {
  throw new Error('not implemented');
}

test('target found in middle',    () => windowHasSum([1, 4, 2, 5, 3], 3, 11),   true);
test('target not found',          () => windowHasSum([1, 4, 2, 5, 3], 3, 15),   false);
test('target at first window',    () => windowHasSum([3, 1, 2, 4, 5], 2, 4),    true);
test('target at last window',     () => windowHasSum([2, 3, 1, 4, 6], 2, 10),   true);
test('k larger than array',       () => windowHasSum([1, 2], 5, 10),            false);
test('negative numbers',          () => windowHasSum([-2, 4, 1, -1, 3], 3, 3),  true);

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
