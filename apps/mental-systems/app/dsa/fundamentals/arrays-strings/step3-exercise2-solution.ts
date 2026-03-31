// =============================================================================
// Arrays & Strings — Level 3, Exercise 2: Ask the Left Messenger — SOLUTION
// =============================================================================
function rangeSum(nums: number[], left: number, right: number): number {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  return prefix[right + 1] - prefix[left];
}

test('full range',      () => rangeSum([1, 2, 3, 4], 0, 3), 10);
test('partial range',   () => rangeSum([1, 2, 3, 4], 1, 3),  9);
test('single element',  () => rangeSum([1, 2, 3, 4], 2, 2),  3);
test('first element',   () => rangeSum([1, 2, 3, 4], 0, 0),  1);
test('with negatives',  () => rangeSum([-1, 2, -3, 4], 1, 3), 3);
test('single-elem arr', () => rangeSum([7], 0, 0),            7);

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
