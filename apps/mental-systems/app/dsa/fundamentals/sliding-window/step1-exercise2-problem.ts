// =============================================================================
// Sliding Window — Level 1, Exercise 2: Lightest k-Chapter Frame
// =============================================================================
// Goal: Practice the fixed-size slide returning a minimum, not a maximum.
//
// The historian now wants the k consecutive chapters with the lowest
// average word count — the lightest frame. Slide the frame across
// the manuscript and track the minimum average seen.
//
// Return the minimum average of any k consecutive elements.
// If k > nums.length, return 0.
//
// Example:
//   minWindowAverage([3, 7, 5, 2, 4, 1], 3) → 7/3 ≈ 2.333  (window [2,4,1])
//   minWindowAverage([1, 4, 2, 5], 2)        → 1.5          (window [1,4]... wait, [1,4]=2.5, [4,2]=3, [2,5]=3.5 — min is 2.5)
//
// Example (corrected):
//   minWindowAverage([1, 4, 2, 5], 2) → 2.5  (window [1,4] has avg 2.5)
//   minWindowAverage([5, 1, 2, 3], 2) → 1.5  (window [1,2] has avg 1.5)
// =============================================================================
function minWindowAverage(nums: number[], k: number): number {
  throw new Error('not implemented');
}

test('min at end',             () => minWindowAverage([3, 7, 5, 2, 4, 1], 3),   7/3);
test('min at start',           () => minWindowAverage([1, 4, 2, 5], 2),         2.5);
test('min in middle',          () => minWindowAverage([5, 1, 2, 3], 2),         1.5);
test('all same elements',      () => minWindowAverage([4, 4, 4, 4], 2),         4.0);
test('k equals array length',  () => minWindowAverage([2, 3, 1], 3),            2.0);
test('k larger than array',    () => minWindowAverage([1, 2], 5),               0);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function test(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass =
      typeof actual === 'number' && typeof expected === 'number'
        ? Math.abs(actual - expected) < 1e-9
        : JSON.stringify(actual) === JSON.stringify(expected);
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
