// =============================================================================
// Product of Array Except Self — Step 2 of 2: Westbound Messenger — SOLUTION
// =============================================================================
// Goal: Walk the westbound messenger right to left, multiplying the running
//       right-product INTO each board slot (which already holds the left product
//       from step 1). After this step, board[i] = product of all nums except nums[i].

function productExceptSelf(nums: number[]): number[] {
  // ✓ Step 1: Eastbound pass — fills board with left products
  const board = new Array(nums.length);
  let leftTally = 1;                       // eastbound messenger's running tally
  for (let i = 0; i < nums.length; i++) {
    board[i] = leftTally;                  // write before absorbing — never includes self
    leftTally *= nums[i];                  // absorb this village's harvest
  }

  // Step 2: Westbound pass — multiplies right products into each board slot
  let rightTally = 1;                      // westbound messenger's running tally
  for (let i = nums.length - 1; i >= 0; i--) {
    board[i] *= rightTally;               // combine: left product × right product
    rightTally *= nums[i];               // absorb this village's harvest before stepping west
  }

  return board;
}

// Tests — all must print PASS
test('[1,2,3,4]', () => productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
test('[2,3]', () => productExceptSelf([2, 3]), [3, 2]);
test('[-1,1,0,-3,3]', () => productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]);
test('zeros [0,1,2]', () => productExceptSelf([0, 1, 2]), [2, 0, 0]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
