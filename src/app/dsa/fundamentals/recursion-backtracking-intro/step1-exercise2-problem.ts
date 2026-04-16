// =============================================================================
// Recursion & Backtracking Intro — Level 1, Exercise 2: Multiply by Climbing
// =============================================================================
// Goal: Compute a × b using only addition and recursion — no * operator.
//       Each step up the mountain adds `a` once; b levels give b additions.
//
// The mountain guide rule:
//   - Base camp: b === 0 → return 0 (no levels left to add)
//   - Recursive case: dispatch multiplyByAdding(a, b-1), then add a once
//
// Example:
//   multiplyByAdding(3, 4) → 12   (3 added 4 times)
//   multiplyByAdding(7, 0) → 0    (base camp)
//   multiplyByAdding(1, 100) → 100
// =============================================================================
function multiplyByAdding(a: number, b: number): number {
  throw new Error('not implemented');
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
