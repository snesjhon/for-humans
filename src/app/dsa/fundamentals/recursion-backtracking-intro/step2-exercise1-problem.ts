// Goal: Practice binary branching by dispatching two scouts per junction with independent state.
//
// At each junction fork into two recursive calls: one passes a new array with
// nums[i] appended (include), and one passes the unchanged current array (skip).
// Merge the two returned lists with concatenation. The base fires when the index
// reaches the end — return a list containing only the current pack as its sole element.
//
// Example:
//   allSubsets([1, 2])  → [[], [1], [2], [1, 2]]  (any order)
//   allSubsets([])      → [[]]

function allSubsets(nums: number[]): number[][] {
  throw new Error('not implemented');
}

// ---Tests
test('empty array', () => allSubsets([]).length, 1);
test('single element count', () => allSubsets([1]).length, 2);
test('two elements count', () => allSubsets([1, 2]).length, 4);
test('three elements count', () => allSubsets([1, 2, 3]).length, 8);
test('contains empty subset', () => allSubsets([1, 2]).some((s) => s.length === 0), true);
test('contains full subset', () => allSubsets([1, 2]).some((s) => JSON.stringify([...s].sort()) === '[1,2]'), true);
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
