// =============================================================================
// Two Pointers — Level 3, Exercise 3: Calculate Trapped Water
// =============================================================================
// Goal: Apply two-pointer with running max — an extension of the greedy gate.
//
// Given an elevation map where each bar has a given height, calculate how much
// rainwater is trapped between the bars after it rains.
//
// Water at position i = min(maxLeft, maxRight) - height[i], where maxLeft is
// the tallest bar seen to the left of i and maxRight to the right.
//
// Two-pointer insight: advance the side with the smaller running max. That side
// is the binding constraint — we already know exactly how much water it can hold
// (leftMax - height[L] or rightMax - height[R]) because the other side is taller.
//
// Example:
//   trappingRainWater([0,1,0,2,1,0,1,3,2,1,2,1]) → 6
//   trappingRainWater([4,2,0,3,2,5])              → 9
// =============================================================================
function trappingRainWater(heights: number[]): number {
  throw new Error('not implemented');
}

test('classic example',    () => trappingRainWater([0,1,0,2,1,0,1,3,2,1,2,1]), 6);
test('second example',     () => trappingRainWater([4,2,0,3,2,5]),             9);
test('empty array',        () => trappingRainWater([]),                         0);
test('single bar',         () => trappingRainWater([5]),                        0);
test('no water ascending', () => trappingRainWater([1,2,3,4,5]),               0);
test('simple valley',      () => trappingRainWater([3,0,3]),                   3);

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
