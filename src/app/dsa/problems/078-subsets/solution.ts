// 78. Subsets — complete solution

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
test('empty nums yields only the empty subset', () => {
  return subsets([]);
}, [[]]);

test('single element: [0] → [[], [0]]', () => {
  return subsets([0]);
}, [[], [0]]);

test('two elements produce four subsets', () => {
  return subsets([1, 2]);
}, [[], [1], [1, 2], [2]]);

test('three elements produce all eight subsets', () => {
  return subsets([1, 2, 3]);
}, [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]);

test('negative numbers are handled correctly', () => {
  return subsets([-1, 0]);
}, [[], [-1], [-1, 0], [0]]);
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
