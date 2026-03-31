// =============================================================================
// Sliding Window — Level 2, Exercise 1: Longest Affordable Passage — SOLUTION
// =============================================================================
// Goal: Practice the variable window expand-then-shrink pattern with a sum budget.
//
// Expand right unconditionally. While sum > budget, shrink from the left.
// After the while-loop the window is valid — record its length.
// =============================================================================
function longestAffordable(nums: number[], budget: number): number {
  let L = 0;
  let sum = 0;
  let maxLen = 0;

  for (let R = 0; R < nums.length; R++) {
    sum += nums[R];
    while (sum > budget) {
      sum -= nums[L];
      L++;
    }
    maxLen = Math.max(maxLen, R - L + 1);
  }

  return maxLen;
}

test('basic case',               () => longestAffordable([3, 1, 2, 5, 1, 1], 7),    3);
test('all elements fit',         () => longestAffordable([1, 1, 1, 1, 1], 3),       3);
test('full array fits',          () => longestAffordable([2, 3, 1], 10),            3);
test('only singles fit',         () => longestAffordable([5, 6, 7], 5),             1);
test('nothing fits',             () => longestAffordable([10, 20, 30], 5),          0);
test('budget exactly met',       () => longestAffordable([2, 1, 2, 1, 2], 5),     3);

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
