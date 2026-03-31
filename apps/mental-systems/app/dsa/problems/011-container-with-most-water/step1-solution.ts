// =============================================================================
// Container With Most Water — Step 1 of 2: The First Measurement — SOLUTION
// =============================================================================
// Goal: Place the left scout at wall 0 and the right scout at the last wall,
//       then compute and return the capacity of that first basin.

function maxArea(height: number[]): number {
  const left = 0;
  const right = height.length - 1;
  // Water level = the shorter cliff; capacity = water level × gap between scouts
  return Math.min(height[left], height[right]) * (right - left);
}

// Tests — all must print PASS
test('two equal walls', () => maxArea([2, 2]), 2);
test('left wall taller', () => maxArea([3, 1]), 1);
test('right wall taller', () => maxArea([5, 8]), 5);

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
    } else {
      throw e;
    }
  }
}
