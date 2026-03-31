// =============================================================================
// Two Pointers — Level 2, Exercise 3: Maximum Capacity at Distance — SOLUTION
// =============================================================================
// Goal: Apply the greedy gate with an additional span constraint.
//
// Same greedy loop as maxContainerArea, but the loop exits early once R - L
// drops below minDistance. Since width only decreases as pointers converge,
// once the minimum span constraint is violated it can never be recovered.
// =============================================================================
function maxContainerAtDistance(heights: number[], minDistance: number): number {
  let L = 0, R = heights.length - 1;
  let maxArea = 0;
  while (L < R && (R - L) >= minDistance) {
    const area = Math.min(heights[L], heights[R]) * (R - L);
    maxArea = Math.max(maxArea, area);
    if (heights[L] <= heights[R]) L++;
    else R--;
  }
  return maxArea;
}

test('basic with constraint',   () => maxContainerAtDistance([3, 1, 5, 2, 4, 6, 3], 4), 18);
test('same as unconstrained',   () => maxContainerAtDistance([1, 8, 6, 2, 5, 4, 8, 3, 7], 2), 49);
test('constraint excludes all', () => maxContainerAtDistance([2, 2], 2), 0);
test('exactly at min distance', () => maxContainerAtDistance([3, 1, 2], 2), 4);
test('uniform heights',         () => maxContainerAtDistance([1, 1, 1], 1), 2);
test('ascending with gap',      () => maxContainerAtDistance([1, 2, 3, 4, 5], 3), 6);

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
