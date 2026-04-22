// Goal: Practice the choose-explore-undo cycle with a boolean marker array instead of a pack.
//
// At each junction scan every item. For items not yet marked: set used[i] = true
// (place marker), push nums[i] onto the current sequence, recurse, then pop and
// set used[i] = false (retrieve marker). The base fires when the current sequence
// reaches nums.length — snapshot it into results. Each leaf is a permutation:
// a route that visits every item exactly once.
//
// Example:
//   allPermutations([1, 2])      → [[1, 2], [2, 1]]  (any order)
//   allPermutations([])          → [[]]

function allPermutations(nums: number[]): number[][] {
  throw new Error('not implemented');
}

// ---Tests
test('empty array', () => JSON.stringify(allPermutations([])), '[[]]');
test('single element', () => JSON.stringify(allPermutations([1])), '[[1]]');
test('two elements count', () => allPermutations([1, 2]).length, 2);
test('three elements count', () => allPermutations([1, 2, 3]).length, 6);
test('contains [1,2]', () => allPermutations([1, 2]).some((p) => JSON.stringify(p) === '[1,2]'), true);
test('contains [2,1]', () => allPermutations([1, 2]).some((p) => JSON.stringify(p) === '[2,1]'), true);
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
