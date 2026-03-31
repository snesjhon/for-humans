// =============================================================================
// Arrays & Strings — Level 3, Exercise 1: Send the Left Messenger
// =============================================================================
// Goal: Practice the forward pass — the left messenger collects context.
//
// The left messenger walks left-to-right. Before reaching each slot i,
// it records what it has accumulated so far (the sum of everything to its left).
// prefix[i] = sum of nums[0..i-1]. prefix[0] is always 0 (nothing to the left).
//
// Example:
//   buildPrefixSums([1, 2, 3, 4]) → [0, 1, 3, 6]
//   buildPrefixSums([3, 3, 3])    → [0, 3, 6]
// =============================================================================
function buildPrefixSums(nums: number[]): number[] {
  throw new Error('not implemented');
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
