// =============================================================================
// Sliding Window — Level 2, Exercise 1: Longest Affordable Passage
// =============================================================================
// Goal: Practice the variable window expand-then-shrink pattern with a sum budget.
//
// The historian has a reading budget — a maximum total word count she can
// fit in her frame. She expands the frame rightward as long as the total
// stays within budget. When it exceeds the budget, she slides the left
// edge until the frame is affordable again.
//
// Return the length of the longest contiguous subarray with sum <= budget.
//
// Example:
//   longestAffordable([3, 1, 2, 5, 1, 1], 7) → 3  (longest window with sum ≤ 7)
//   longestAffordable([1, 1, 1, 1, 1], 3)    → 3  (any three consecutive 1s)
// =============================================================================
function longestAffordable(nums: number[], budget: number): number {
  throw new Error('not implemented');
}

test('basic case',               () => longestAffordable([3, 1, 2, 5, 1, 1], 7),    3);
test('all elements fit',         () => longestAffordable([1, 1, 1, 1, 1], 3),       3);
test('full array fits',          () => longestAffordable([2, 3, 1], 10),            3);
test('only singles fit',         () => longestAffordable([5, 6, 7], 5),             1);
test('nothing fits',             () => longestAffordable([10, 20, 30], 5),          0);
test('budget exactly met',       () => longestAffordable([2, 1, 2, 1, 2], 5),     3);

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
