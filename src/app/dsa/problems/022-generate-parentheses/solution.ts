// Goal: Generate every well-formed parentheses string by exploring only legal
// prefixes. Add '(' while openCount < n, add ')' while closeCount < openCount.

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

    if (closeCount < openCount) {
      route.push(')');
      backtrack(openCount, closeCount + 1);
      route.pop();
    }
  }

  backtrack(0, 0);
  return results;
}

// ---Tests
runTest('n = 0: internal edge case for the empty trail', () => {
  return generateParenthesis(0);
}, ['']);

runTest('n = 1: one valid trail', () => {
  return generateParenthesis(1);
}, ['()']);

runTest('n = 2: two valid trails', () => {
  return generateParenthesis(2);
}, ['(())', '()()']);

runTest('n = 3: prompt example order', () => {
  return generateParenthesis(3);
}, ['((()))', '(()())', '(())()', '()(())', '()()()']);

runTest('n = 4: fourteen valid trails', () => {
  return generateParenthesis(4);
}, [
  '(((())))',
  '((()()))',
  '((())())',
  '((()))()',
  '(()(()))',
  '(()()())',
  '(()())()',
  '(())(())',
  '(())()()',
  '()((()))',
  '()(()())',
  '()(())()',
  '()()(())',
  '()()()()',
]);
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
