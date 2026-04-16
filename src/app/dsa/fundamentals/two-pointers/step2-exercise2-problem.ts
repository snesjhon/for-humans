// Goal: Apply the greedy gate insight to a threshold search instead of a max.
//
// Two surveyors start at opposite ends of a valley. They need to find the
// widest possible span (R - L) between two walls where the container area
// is at least minArea. Return -1 if no such pair exists.
//
// Key insight: start with the widest span (L=0, R=n-1). If the area already
// meets minArea, return immediately — this is the widest possible span.
// If not, the same greedy argument applies: move the shorter gate inward.
// Because skipped pairs are provably no better AND narrower, the first valid
// pair found is the widest valid pair.
//
// Example:
//   largestWindowWidth([3, 1, 5, 2, 4], 12)       → 4  (walls at 0 and 4)
//   largestWindowWidth([1, 8, 6, 2, 5, 4, 8, 3, 7], 49) → 7  (walls at 1 and 8)
//   largestWindowWidth([1, 1], 2)                  → -1 (max area is 1)
function largestWindowWidth(heights: number[], minArea: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('first pair qualifies',   () => largestWindowWidth([3, 1, 5, 2, 4], 12),              4);
test('first pair too small',   () => largestWindowWidth([1, 8, 6, 2, 5, 4, 8, 3, 7], 49), 7);
test('no pair qualifies',      () => largestWindowWidth([1, 1], 2),                        -1);
test('two walls exact',        () => largestWindowWidth([3, 3], 3),                        1);
test('two walls insufficient', () => largestWindowWidth([1, 2], 3),                        -1);
test('inner pair is widest',   () => largestWindowWidth([2, 5, 5, 5, 5, 2], 15),           3);
// ---End Tests

// ---Helpers
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
