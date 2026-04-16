// =============================================================================
// Recursion & Backtracking Intro — Level 2, Exercise 1: Three Sub-Peaks — SOLUTION
// =============================================================================
// Goal: Implement tribonacci WITHOUT memoization to feel the cost of
//       re-climbing the same sub-peaks repeatedly.
function tribonacci(n: number): number {
  if (n === 0 || n === 1) return 0;  // base camp — flat ground
  if (n === 2) return 1;             // base camp — second flat ground
  return tribonacci(n - 1) + tribonacci(n - 2) + tribonacci(n - 3);
}

test('base camp: T(0) = 0', () => tribonacci(0), 0);
test('base camp: T(1) = 0', () => tribonacci(1), 0);
test('base camp: T(2) = 1', () => tribonacci(2), 1);
test('T(3) = 1', () => tribonacci(3), 1);
test('T(4) = 2', () => tribonacci(4), 2);
test('T(5) = 4', () => tribonacci(5), 4);
test('T(7) = 13', () => tribonacci(7), 13);

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
