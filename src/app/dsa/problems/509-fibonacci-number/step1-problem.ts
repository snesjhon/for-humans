// Goal: Return the two Fibonacci base cases directly: `fib(0) = 0` and
// `fib(1) = 1`. Larger inputs are not solved yet in this step.

function fib(n: number): number {
  throw new Error('not implemented');
}

// ---Tests
runTest('base case: fib(0) = 0', () => fib(0), 0);
runTest('base case: fib(1) = 1', () => fib(1), 1);
// ---End Tests

// ---Helpers
function runTest(desc: string, fn: () => unknown, expected: unknown): void {
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
