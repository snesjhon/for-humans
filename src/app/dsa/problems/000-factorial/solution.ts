// Goal: Solve factorial with the core recursion pattern: return the base case
// for 0, otherwise multiply n by factorial(n - 1).

function factorial(n: number): number {
  if (n === 0) {
    return 1;
  }

  return n * factorial(n - 1);
}

// ---Tests
runTest('base case: factorial(0) = 1', () => factorial(0), 1);
runTest('first recursive result: factorial(1) = 1', () => factorial(1), 1);
runTest('small recursive result: factorial(3) = 6', () => factorial(3), 6);
runTest('prompt example: factorial(5) = 120', () => factorial(5), 120);
runTest('larger recursive input: factorial(6) = 720', () => factorial(6), 720);
runTest('upper-range intro check: factorial(7) = 5040', () => factorial(7), 5040);
// ---End Tests

// ---Helpers
function runTest(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
