// =============================================================================
// Sliding Window — Level 1, Exercise 3: Hit Target in k Chapters — SOLUTION
// =============================================================================
// Goal: Practice fixed-size window slide checking an exact condition per window.
//
// Build the first window. If it matches, return true.
// Slide: add nums[R], remove nums[R-k], check sum === target.
// If no window matches, return false.
// =============================================================================
function windowHasSum(nums: number[], k: number, target: number): boolean {
  if (k > nums.length) return false;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  if (windowSum === target) return true;

  for (let R = k; R < nums.length; R++) {
    windowSum += nums[R] - nums[R - k];
    if (windowSum === target) return true;
  }

  return false;
}

test('target found in middle',    () => windowHasSum([1, 4, 2, 5, 3], 3, 11),   true);
test('target not found',          () => windowHasSum([1, 4, 2, 5, 3], 3, 15),   false);
test('target at first window',    () => windowHasSum([3, 1, 2, 4, 5], 2, 4),    true);
test('target at last window',     () => windowHasSum([2, 3, 1, 4, 6], 2, 10),   true);
test('k larger than array',       () => windowHasSum([1, 2], 5, 10),            false);
test('negative numbers',          () => windowHasSum([-2, 4, 1, -1, 3], 3, 3),  true);

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
