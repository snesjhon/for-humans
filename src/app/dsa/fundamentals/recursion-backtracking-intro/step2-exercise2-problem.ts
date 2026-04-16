// =============================================================================
// Recursion & Backtracking Intro — Level 2, Exercise 2: Install the Summit Log
// =============================================================================
// Goal: Add a summit log (memo Map) to tribonacci so each sub-peak is
//       climbed at most once. The first apprentice back writes the result;
//       every subsequent guide just reads from the log.
//
// Same recurrence as Exercise 1, but with memoization:
//   T(0) = 0, T(1) = 0, T(2) = 1
//   T(n) = T(n-1) + T(n-2) + T(n-3)
//
// Example:
//   tribonacciMemo(10) → 81
//   tribonacciMemo(20) → 35890
//   (These would hang without the summit log)
// =============================================================================
function tribonacciMemo(n: number, memo: Map<number, number> = new Map()): number {
  throw new Error('not implemented');
}

test('base camp: T(0) = 0', () => tribonacciMemo(0), 0);
test('base camp: T(1) = 0', () => tribonacciMemo(1), 0);
test('base camp: T(2) = 1', () => tribonacciMemo(2), 1);
test('T(5) = 4', () => tribonacciMemo(5), 4);
test('T(10) = 81', () => tribonacciMemo(10), 81);
test('T(20) = 35890', () => tribonacciMemo(20), 35890);

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
