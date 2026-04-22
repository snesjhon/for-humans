// Goal: Practice the choose-explore-undo cycle using one shared pack and explicit push/pop.

function buildSubsets(nums: number[]): number[][] {
  const results: number[][] = [];
  const pack: number[] = [];

  function backtrack(i: number): void {
    results.push([...pack]);
    for (let j = i; j < nums.length; j++) {
      pack.push(nums[j]);
      backtrack(j + 1);
      pack.pop();
    }
  }

  backtrack(0);
  return results;
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
