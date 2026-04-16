// Goal: Inside subsets(), declare results and suitcase, define backtrack(start) as a
// closure that records [...suitcase] into results, add a for-loop header from start to
// nums.length-1 (body empty), then call backtrack(0) and return results.

function subsets(nums: number[]): number[][] {
  const results: number[][] = [];
  const suitcase: number[] = [];

  function backtrack(start: number): void {
    results.push([...suitcase]);
    for (let i = start; i < nums.length; i++) {
      // loop body filled in next step
      void i;
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

test('single element: only the empty suitcase is recorded (loop body not yet filled)', () => {
// ---End Tests
  return subsets([5]);
}, [[]]);
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
