// =============================================================================
// Sliding Window — Level 1, Exercise 1: Best k-Chapter Run
// =============================================================================
// Goal: Practice the fixed-size window slide — add one element, remove one element.
//
// A historian frames exactly k consecutive chapters and measures the
// total word count inside the frame. She slides the frame one chapter
// at a time to find the passage with the highest total word count.
//
// Return the maximum sum of any k consecutive elements.
// If k > nums.length, return 0.
//
// Example:
//   maxWindowSum([2, 1, 5, 1, 3, 2], 3)  → 9  (window [5,1,3])
//   maxWindowSum([1, 3, 2, 6, -1, 4], 2) → 8  (window [2,6])
// =============================================================================
function maxWindowSum(nums: number[], k: number): number {
  throw new Error('not implemented');
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
