// =============================================================================
// Recursion & Backtracking Intro — Level 2, Exercise 1: Three Sub-Peaks
// =============================================================================
// Goal: Implement tribonacci WITHOUT memoization to feel the cost of
//       re-climbing the same sub-peaks repeatedly.
//
// Tribonacci rule: T(n) = T(n-1) + T(n-2) + T(n-3)
// Three apprentices dispatched per step — the call tree branches three ways.
//
// Base camp (three separate stopping points):
//   T(0) = 0, T(1) = 0, T(2) = 1
//
// Example:
//   tribonacci(3) → 1   (T(2) + T(1) + T(0) = 1+0+0)
//   tribonacci(5) → 4   (T(4) + T(3) + T(2) = 2+1+1)
//   tribonacci(7) → 13
//
// Note: this version is intentionally slow for large n. That slowness is
// the lesson — the same sub-peaks are climbed over and over.
// =============================================================================
function tribonacci(n: number): number {
  throw new Error('not implemented');
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
