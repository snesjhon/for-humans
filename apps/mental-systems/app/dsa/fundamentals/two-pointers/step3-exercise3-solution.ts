// =============================================================================
// Two Pointers — Level 3, Exercise 3: Calculate Trapped Water — SOLUTION
// =============================================================================
// Goal: Apply two-pointer with running max — an extension of the greedy gate.
//
// Two pointers L and R converge from both ends. At each step: the side with
// the smaller running max is the binding constraint — advance it and add
// (runningMax - height[side]) to the water total. The other side is taller
// so it will not overflow — the water at the current position is determined
// entirely by the smaller max.
// =============================================================================
function trappingRainWater(heights: number[]): number {
  let L = 0, R = heights.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  while (L < R) {
    if (heights[L] <= heights[R]) {
      leftMax = Math.max(leftMax, heights[L]);
      water += leftMax - heights[L];
      L++;
    } else {
      rightMax = Math.max(rightMax, heights[R]);
      water += rightMax - heights[R];
      R--;
    }
  }
  return water;
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
