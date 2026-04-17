// Goal: Inside generateParenthesis(), create results and route, define
// backtrack(openCount, closeCount), record route.join('') when route.length === 2 * n,
// then call backtrack(0, 0) and return results. Do not add any branching yet.

function generateParenthesis(n: number): string[] {
  throw new Error('not implemented');
}

// ---Tests
runTest('n = 0: the empty trail is already complete', () => {
  return generateParenthesis(0);
}, ['']);

runTest('n = 1: no branches exist yet, so no non-empty trail can finish', () => {
  return generateParenthesis(1);
}, []);
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
