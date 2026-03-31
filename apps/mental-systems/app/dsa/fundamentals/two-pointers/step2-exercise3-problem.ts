// =============================================================================
// Two Pointers — Level 2, Exercise 3: Maximum Capacity at Distance
// =============================================================================
// Goal: Apply the greedy gate with an additional span constraint.
//
// Two surveyors must stand at least minDistance positions apart — the reservoir
// cannot be narrower than a required minimum width. Among all valid pairs
// (where R - L >= minDistance), find the one with the maximum container area.
// Return 0 if no pair meets the distance requirement.
//
// The greedy gate argument still holds: once R - L drops below minDistance,
// stop. The skipped pairs (with the same shorter-gate logic) are provably
// no better than what has already been seen.
//
// Example:
//   maxContainerAtDistance([3,1,5,2,4,6,3], 4)  → 18  (walls at 0 and 6)
//   maxContainerAtDistance([2, 2], 2)             → 0   (only span is 1, too narrow)
// =============================================================================
function maxContainerAtDistance(heights: number[], minDistance: number): number {
  throw new Error('not implemented');
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
