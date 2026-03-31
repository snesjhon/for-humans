// =============================================================================
// Hash Maps & Sets — Level 3, Exercise 2: Longest Stretch Between Checkpoints — SOLUTION
// =============================================================================
// Goal: Use a running tally + checkpoint map to find the LENGTH of the longest
//       contiguous subarray whose elements sum to exactly k.
function longestSubarrayWithSum(nums: number[], k: number): number {
  // Store first occurrence index for each prefix sum — earliest checkpoint wins
  const firstAt = new Map<number, number>();
  firstAt.set(0, -1); // seed: empty prefix at index -1

  let sum = 0;
  let maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (firstAt.has(sum - k)) {
      maxLen = Math.max(maxLen, i - firstAt.get(sum - k)!);
    }
    // Only store the FIRST time we see this sum — earlier checkpoint = longer subarray
    if (!firstAt.has(sum)) {
      firstAt.set(sum, i);
    }
  }

  return maxLen;
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
