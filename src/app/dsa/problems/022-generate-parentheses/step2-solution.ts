// Goal: Keep the recording frame from step 1, then add the uphill branch:
// if (openCount < n), push '(', recurse with openCount + 1, then pop.

function generateParenthesis(n: number): string[] {
  const results: string[] = [];
  const route: string[] = [];

  function backtrack(openCount: number, closeCount: number): void {
    if (route.length === 2 * n) {
      results.push(route.join(''));
      return;
    }

    if (openCount < n) {
      route.push('(');
      backtrack(openCount + 1, closeCount);
      route.pop();
    }
  }

  backtrack(0, 0);
  return results;
}

// ---Tests
runTest('n = 0: the empty trail is already complete', () => {
  return generateParenthesis(0);
}, ['']);

runTest('n = 1: uphill exists, but no downhill branch means no full trail yet', () => {
  return generateParenthesis(1);
}, []);

runTest('n = 2: step 2 can build legal uphill prefixes only', () => {
  return generateParenthesis(2);
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
