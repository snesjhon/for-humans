// Goal: Return the factorial base case directly. When n is 0, return 1.
// Larger inputs are not solved yet in this step.

function factorial(n: number): number {
  if (n === 0) {
    return 1;
  }

  throw new Error('not implemented');
}

// ---Tests
runTest('base case: factorial(0) = 1', () => factorial(0), 1);
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
