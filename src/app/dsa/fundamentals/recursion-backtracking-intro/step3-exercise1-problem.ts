// Goal: Practice the choose-explore-undo cycle using one shared pack and explicit push/pop.
//
// At every junction — not only at leaves — snapshot the current pack into the
// results list first. Then for each remaining item: push it onto the shared pack
// (place marker), recurse from the next index (explore), then pop it (retrieve
// marker). This records every partial pack as a valid subset and produces all
// 2^N subsets through a single shared array with no copies during traversal.
//
// Example:
//   buildSubsets([1, 2])  → [[], [1], [1, 2], [2]]  (any order)
//   buildSubsets([])      → [[]]

function buildSubsets(nums: number[]): number[][] {
  throw new Error('not implemented');
}

// ---Tests
test('empty array', () => buildSubsets([]).length, 1);
test('single element count', () => buildSubsets([1]).length, 2);
test('two elements count', () => buildSubsets([1, 2]).length, 4);
test('three elements count', () => buildSubsets([1, 2, 3]).length, 8);
test('contains empty subset', () => buildSubsets([1, 2]).some((s) => s.length === 0), true);
test('contains full subset', () => buildSubsets([1, 2]).some((s) => JSON.stringify([...s].sort()) === '[1,2]'), true);
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
