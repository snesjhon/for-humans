// Goal: Inside subsets(), declare results and suitcase, define backtrack(start) as a
// closure that records [...suitcase] into results, add a for-loop header from start to
// nums.length-1 (body empty), then call backtrack(0) and return results.

function subsets(nums: number[]): number[][] {
  throw new Error('not implemented');
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
