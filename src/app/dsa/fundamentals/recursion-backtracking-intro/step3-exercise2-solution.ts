// Goal: Practice the choose-explore-undo cycle with a boolean marker array instead of a pack.

function allPermutations(nums: number[]): number[][] {
  const results: number[][] = [];
  const current: number[] = [];
  const used: boolean[] = new Array(nums.length).fill(false);

  function backtrack(): void {
    if (current.length === nums.length) {
      results.push([...current]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return results;
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
