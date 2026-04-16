// =============================================================================
// Recursion & Backtracking Intro — Level 1, Exercise 1: Climb to Base Camp
// =============================================================================
// Goal: Write a linear recursion that sums all integers from 1 to n by
//       dispatching an apprentice to the peak just below and taking one step.
//
// The mountain guide rule:
//   - Base camp: n === 0 → return 0 (flat ground, answered directly)
//   - Recursive case: dispatch sumRange(n-1), then take one step: n + result
//
// Example:
//   sumRange(4) → 10   (4 + 3 + 2 + 1 + 0 = 10)
//   sumRange(0) → 0    (already at base camp)
//   sumRange(1) → 1
// =============================================================================
function sumRange(n: number): number {
  throw new Error('not implemented');
}

test('base camp: n=0 returns 0', () => sumRange(0), 0);
test('n=1 returns 1', () => sumRange(1), 1);
test('n=4 returns 10', () => sumRange(4), 10);
test('n=5 returns 15', () => sumRange(5), 15);
test('n=10 returns 55', () => sumRange(10), 55);

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
    } else {
      throw e;
    }
  }
}
// ---End Helpers
