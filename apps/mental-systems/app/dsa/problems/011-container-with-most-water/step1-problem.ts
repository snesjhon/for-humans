// =============================================================================
// Container With Most Water — Step 1 of 2: The First Measurement
// =============================================================================
// Goal: Place the left scout at wall 0 and the right scout at the last wall,
//       then compute and return the capacity of that first basin.

function maxArea(height: number[]): number {
  throw new Error('not implemented');
}

// Tests — 2-element inputs (the starting position is the only measurement)
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
