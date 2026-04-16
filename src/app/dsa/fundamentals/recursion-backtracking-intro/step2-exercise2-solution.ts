// =============================================================================
// Recursion & Backtracking Intro — Level 2, Exercise 2: Install the Summit Log — SOLUTION
// =============================================================================
// Goal: Add a summit log (memo Map) to tribonacci so each sub-peak is
//       climbed at most once.
function tribonacciMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n === 0 || n === 1) return 0;  // base camp
  if (n === 2) return 1;             // base camp
  if (memo.has(n)) return memo.get(n)!;  // check the summit log first

  const result = tribonacciMemo(n - 1, memo)
               + tribonacciMemo(n - 2, memo)
               + tribonacciMemo(n - 3, memo);
  memo.set(n, result);  // write result to summit log before returning
  return result;
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
