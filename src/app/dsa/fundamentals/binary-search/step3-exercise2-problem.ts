// =============================================================================
// Binary Search — Level 3, Exercise 2: Calibrate the First Square That Covers
// =============================================================================
// Goal: Search the answer rail for the smallest integer whose square reaches the target.
//
// Return the smallest integer x such that x * x >= target.
//
// Example:
//   smallestSquareCeil(20) → 5
//   smallestSquareCeil(25) → 5
// =============================================================================
function smallestSquareCeil(target: number): number {
  throw new Error('not implemented');
}

test('square ceiling above target', () => smallestSquareCeil(20), 5);
test('perfect square stays exact', () => smallestSquareCeil(25), 5);
test('small target', () => smallestSquareCeil(1), 1);
test('zero target', () => smallestSquareCeil(0), 0);
test('between squares', () => smallestSquareCeil(50), 8);
test('next square after 2', () => smallestSquareCeil(2), 2);

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
