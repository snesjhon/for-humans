// =============================================================================
// Product of Array Except Self — Complete Solution
// =============================================================================
// Two-messenger approach: eastbound pass fills left products, westbound pass
// multiplies in right products. O(n) time, O(1) extra space.

function productExceptSelf(nums: number[]): number[] {
  const board = new Array(nums.length);  // village board — one slot per village

  // Eastbound pass: fill board with left products
  let leftTally = 1;                     // product of all villages seen so far (coming from the west)
  for (let i = 0; i < nums.length; i++) {
    board[i] = leftTally;               // write BEFORE absorbing — board[i] = product of nums[0..i-1]
    leftTally *= nums[i];               // absorb this village's harvest, continue east
  }

  // Westbound pass: multiply right products into each board slot
  let rightTally = 1;                    // product of all villages seen so far (coming from the east)
  for (let i = nums.length - 1; i >= 0; i--) {
    board[i] *= rightTally;             // combine left × right — board[i] = product of all except nums[i]
    rightTally *= nums[i];             // absorb this village's harvest, continue west
  }

  return board;
}

// Tests — all must print PASS
test('[1,2,3,4]', () => productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
test('[2,3]', () => productExceptSelf([2, 3]), [3, 2]);
test('[-1,1,0,-3,3]', () => productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]);
test('zeros [0,1,2]', () => productExceptSelf([0, 1, 2]), [2, 0, 0]);
test('single element', () => productExceptSelf([42]), [1]);
test('negatives [2,-3,4]', () => productExceptSelf([2, -3, 4]), [-12, 8, -6]);

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
