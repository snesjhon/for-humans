// =============================================================================
// Sliding Window — Level 1, Exercise 1: Best k-Chapter Run — SOLUTION
// =============================================================================
// Goal: Practice the fixed-size window slide — add one element, remove one element.
//
// Build the first window sum manually (indices 0..k-1).
// Then slide: for each R from k to n-1, add nums[R] and remove nums[R-k].
// Track the maximum sum seen across all windows.
// =============================================================================
function maxWindowSum(nums: number[], k: number): number {
  if (k > nums.length) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  for (let R = k; R < nums.length; R++) {
    windowSum += nums[R] - nums[R - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

test('basic window, max in middle',  () => maxWindowSum([2, 1, 5, 1, 3, 2], 3),     9);
test('two-element window',           () => maxWindowSum([1, 3, 2, 6, -1, 4], 2),    8);
test('window equals array length',   () => maxWindowSum([4, 2, 7], 3),              13);
test('max at beginning',             () => maxWindowSum([9, 2, 1, 3], 2),           11);
test('k larger than array',          () => maxWindowSum([1, 2], 5),                  0);
test('single element window',        () => maxWindowSum([7, 3, 1], 1),               7);

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
