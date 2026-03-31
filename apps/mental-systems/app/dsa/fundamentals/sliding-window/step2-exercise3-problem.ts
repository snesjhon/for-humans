// =============================================================================
// Sliding Window — Level 2, Exercise 3: Shortest Passage Reaching the Quota
// =============================================================================
// Goal: Practice the minimize-window variation — record when valid, keep shrinking.
//
// The historian needs a passage with at least minSum total words — but she
// wants the shortest such passage possible. She expands until the quota
// is met, records the frame length, then tightens from the left to see
// if a shorter passage still meets the quota.
//
// Return the minimum length of a contiguous subarray with sum >= minSum.
// Return 0 if no such subarray exists.
//
// Example:
//   shortestSufficient([2, 3, 1, 2, 4, 3], 7) → 2  (window [4,3] = 7)
//   shortestSufficient([1, 1, 1, 1], 10)       → 0  (impossible)
// =============================================================================
function shortestSufficient(nums: number[], minSum: number): number {
  throw new Error('not implemented');
}

test('basic case',               () => shortestSufficient([2, 3, 1, 2, 4, 3], 7),    2);
test('whole array needed',       () => shortestSufficient([1, 2, 3], 6),             3);
test('impossible',               () => shortestSufficient([1, 1, 1, 1], 10),        0);
test('first element qualifies',  () => shortestSufficient([10, 2, 3], 5),            1);
test('last element qualifies',   () => shortestSufficient([1, 2, 10], 9),            1);
test('tie between positions',    () => shortestSufficient([1, 4, 4], 4),             1);

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
