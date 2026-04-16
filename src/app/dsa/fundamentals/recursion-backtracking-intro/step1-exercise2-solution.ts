// =============================================================================
// Recursion & Backtracking Intro — Level 1, Exercise 2: Multiply by Climbing — SOLUTION
// =============================================================================
// Goal: Compute a × b using only addition and recursion — no * operator.
function multiplyByAdding(a: number, b: number): number {
  if (b === 0) return 0;                          // base camp — nothing left to add
  return a + multiplyByAdding(a, b - 1);         // take one step: add a once
}

test('base camp: b=0 returns 0', () => multiplyByAdding(3, 0), 0);
test('a=0 always returns 0', () => multiplyByAdding(0, 5), 0);
test('3 × 4 = 12', () => multiplyByAdding(3, 4), 12);
test('7 × 3 = 21', () => multiplyByAdding(7, 3), 21);
test('1 × 100 = 100', () => multiplyByAdding(1, 100), 100);
test('5 × 5 = 25', () => multiplyByAdding(5, 5), 25);

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
