// =============================================================================
// Two Pointers — Level 2, Exercise 2: Widest Viable Gate — SOLUTION
// =============================================================================
// Goal: Apply the greedy gate insight to a threshold search instead of a max.
//
// Start with the widest span (L=0, R=n-1). If area >= minArea, return R-L
// immediately — this is the widest possible span. Otherwise use the same
// greedy rule: move the shorter gate. Proof: skipped pairs have area at most
// height[shorter] * (R-L-1) < height[shorter] * (R-L) — provably not better.
// The first valid pair found during the greedy walk IS the widest valid pair.
// =============================================================================
function largestWindowWidth(heights: number[], minArea: number): number {
  let L = 0, R = heights.length - 1;
  while (L < R) {
    const area = Math.min(heights[L], heights[R]) * (R - L);
    if (area >= minArea) return R - L;
    if (heights[L] <= heights[R]) L++;
    else R--;
  }
  return -1;
}

test('first pair qualifies',   () => largestWindowWidth([3, 1, 5, 2, 4], 12),              4);
test('first pair too small',   () => largestWindowWidth([1, 8, 6, 2, 5, 4, 8, 3, 7], 49), 7);
test('no pair qualifies',      () => largestWindowWidth([1, 1], 2),                        -1);
test('two walls exact',        () => largestWindowWidth([3, 3], 3),                        1);
test('two walls insufficient', () => largestWindowWidth([1, 2], 3),                        -1);
test('inner pair is widest',   () => largestWindowWidth([2, 5, 5, 5, 5, 2], 15),           3);

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
