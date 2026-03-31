// =============================================================================
// Hash Maps & Sets — Level 3, Exercise 2: Longest Stretch Between Checkpoints
// =============================================================================
// Goal: Use a running tally + checkpoint map to find the LENGTH of the longest
//       contiguous subarray whose elements sum to exactly k.
//
// Store the FIRST index at which each tally value was seen (the earliest
// checkpoint). The distance from that checkpoint to the current position gives
// the longest possible subarray ending here with the target sum.
//
// Example:
//   longestSubarrayWithSum([1, -1, 5, -2, 3], 3)  → 4  ([1,-1,5,-2])
//   longestSubarrayWithSum([1, 2, 3], 3)           → 2  ([1,2])
//   longestSubarrayWithSum([1, 2, 3], 6)           → 3  (whole array)
//   longestSubarrayWithSum([1, 2, 3], 7)           → 0  (none)
// =============================================================================
function longestSubarrayWithSum(nums: number[], k: number): number {
  throw new Error('not implemented');
}

test('no match', () => longestSubarrayWithSum([1, 2, 3], 7), 0);
test('whole array', () => longestSubarrayWithSum([1, 2, 3], 6), 3);
test('prefer longer', () => longestSubarrayWithSum([1, -1, 5, -2, 3], 3), 4);
test('first match of two', () => longestSubarrayWithSum([1, 2, 3], 3), 2);
test('single element', () => longestSubarrayWithSum([5], 5), 1);
test('negative target', () => longestSubarrayWithSum([1, 2, -3, 1], -2), 2);

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
    } else {
      throw e;
    }
  }
}
