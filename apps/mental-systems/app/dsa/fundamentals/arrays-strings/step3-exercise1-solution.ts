// =============================================================================
// Arrays & Strings — Level 3, Exercise 1: Send the Left Messenger — SOLUTION
// =============================================================================
function buildPrefixSums(nums: number[]): number[] {
  const prefix = new Array(nums.length).fill(0);
  for (let i = 1; i < nums.length; i++) {
    prefix[i] = prefix[i - 1] + nums[i - 1];
  }
  return prefix;
}

test('basic',      () => buildPrefixSums([1, 2, 3, 4]), [0, 1, 3, 6]);
test('all same',   () => buildPrefixSums([3, 3, 3]),    [0, 3, 6]);
test('single',     () => buildPrefixSums([5]),           [0]);
test('empty',      () => buildPrefixSums([]),            []);
test('negatives',  () => buildPrefixSums([-1, -2, 3]),   [0, -1, -3]);
test('zeros',      () => buildPrefixSums([0, 0, 0]),     [0, 0, 0]);

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
