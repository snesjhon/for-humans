// Goal: Practice the choose-explore-undo cycle with constraint pruning to eliminate dead branches.
//
// Generate all k-length combinations of integers from 1 through n in sorted order.
// At each junction push the next integer (place marker), recurse from the next
// start, then pop (retrieve marker). Prune when the remaining integers cannot fill
// the remaining slots: if n - start + 1 < k - current.length, break the loop
// immediately — no valid combination can be completed from this junction.
//
// Example:
//   generateCombinations(4, 2)  → [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
//   generateCombinations(3, 3)  → [[1,2,3]]

function generateCombinations(n: number, k: number): number[][] {
  throw new Error('not implemented');
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
