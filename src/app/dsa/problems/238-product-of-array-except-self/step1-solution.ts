// Goal: Walk the eastbound messenger left to right, writing the running left-product
//       to each village's board slot BEFORE absorbing the current harvest.
//
// After this step, board[i] = product of nums[0..i-1]  (everything to the LEFT of i)

function productExceptSelf(nums: number[]): number[] {
  const board = new Array(nums.length);  // village board — one slot per village

  let leftTally = 1;                     // eastbound messenger starts with empty-product tally
  for (let i = 0; i < nums.length; i++) {
    board[i] = leftTally;               // write BEFORE absorbing — never includes current village
    leftTally *= nums[i];               // absorb this village's harvest, then move east
  }

  return board;
}

// ---Tests
test('single element', () => productExceptSelf([5]), [1]);
test('[1,2,3,4] — left products', () => productExceptSelf([1, 2, 3, 4]), [1, 1, 2, 6]);
test('[2,3,4] — left products', () => productExceptSelf([2, 3, 4]), [1, 2, 6]);
test('zeros [0,1,2] — left products', () => productExceptSelf([0, 1, 2]), [1, 0, 0]);
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
    } else { throw e; }
  }
}
