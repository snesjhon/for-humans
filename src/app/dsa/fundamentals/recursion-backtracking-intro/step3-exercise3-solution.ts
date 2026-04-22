// Goal: Practice the choose-explore-undo cycle with constraint pruning to eliminate dead branches.

function generateCombinations(n: number, k: number): number[][] {
  const results: number[][] = [];
  const current: number[] = [];

  function backtrack(start: number): void {
    if (current.length === k) {
      results.push([...current]);
      return;
    }
    for (let i = start; i <= n; i++) {
      if (n - i + 1 < k - current.length) break;
      current.push(i);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(1);
  return results;
}

// ---Tests
test('k=0 returns empty combination', () => generateCombinations(4, 0), [[]]);
test('k=1 returns singletons', () => generateCombinations(3, 1), [[1], [2], [3]]);
test('k equals n', () => generateCombinations(3, 3), [[1, 2, 3]]);
test('k greater than n', () => generateCombinations(2, 3), []);
test('4 choose 2 count', () => generateCombinations(4, 2).length, 6);
test('4 choose 2 first entry', () => generateCombinations(4, 2)[0], [1, 2]);
// ---End Tests

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
