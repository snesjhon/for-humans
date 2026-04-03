// Goal: Keep the base cases, then solve every larger ticket by returning
// `fib(n - 1) + fib(n - 2)`.

function fib(n: number): number {
  if (n === 0) {
    return 0;
  }

  if (n === 1) {
    return 1;
  }

  throw new Error('not implemented');
}

// ---Tests
runTest('base case: fib(0) = 0', () => fib(0), 0);
runTest('base case: fib(1) = 1', () => fib(1), 1);
runTest('first recursive result: fib(2) = 1', () => fib(2), 1);
runTest('next recursive result: fib(3) = 2', () => fib(3), 2);
runTest('prompt example: fib(4) = 3', () => fib(4), 3);
runTest('larger recursive input: fib(6) = 8', () => fib(6), 8);
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
