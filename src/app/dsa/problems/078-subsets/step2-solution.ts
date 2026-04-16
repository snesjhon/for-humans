// Goal: Fill the for-loop body in backtrack: push nums[i] into suitcase,
// call backtrack(i + 1), then pop from suitcase.

function subsets(nums: number[]): number[][] {
  const results: number[][] = [];
  const suitcase: number[] = [];

  function backtrack(start: number): void {
    results.push([...suitcase]);
    for (let i = start; i < nums.length; i++) {
      suitcase.push(nums[i]);
      backtrack(i + 1);
      suitcase.pop();
    }
  }

  backtrack(0);
  return results;
}

// ---Tests
// ---Tests
test('empty nums yields one subset: the empty suitcase', () => {
  return subsets([]);
}, [[]]);

test('single element produces two subsets', () => {
  return subsets([5]);
}, [[], [5]]);

test('two elements produce four subsets', () => {
  return subsets([1, 2]);
}, [[], [1], [1, 2], [2]]);

test('three elements produce all eight subsets', () => {
// ---End Tests
  return subsets([1, 2, 3]);
}, [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]);
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
