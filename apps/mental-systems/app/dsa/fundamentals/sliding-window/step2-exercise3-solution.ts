// =============================================================================
// Sliding Window — Level 2, Exercise 3: Shortest Passage Reaching the Quota — SOLUTION
// =============================================================================
// Goal: Practice the minimize-window variation — record when valid, keep shrinking.
//
// Expand right unconditionally. When sum >= minSum (valid window):
//   1. Record R - L + 1 as a candidate minimum.
//   2. Shrink from the left, check again — keep recording while valid.
// This is the minimize pattern: record first, then shrink.
// =============================================================================
function shortestSufficient(nums: number[], minSum: number): number {
  let L = 0;
  let sum = 0;
  let minLen = Infinity;

  for (let R = 0; R < nums.length; R++) {
    sum += nums[R];
    while (sum >= minSum) {
      minLen = Math.min(minLen, R - L + 1);
      sum -= nums[L];
      L++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

test('basic case',               () => shortestSufficient([2, 3, 1, 2, 4, 3], 7),    2);
test('whole array needed',       () => shortestSufficient([1, 2, 3], 6),             3);
test('impossible',               () => shortestSufficient([1, 1, 1, 1], 10),        0);
test('first element qualifies',  () => shortestSufficient([10, 2, 3], 5),            1);
test('last element qualifies',   () => shortestSufficient([1, 2, 10], 9),            1);
test('tie between positions',    () => shortestSufficient([1, 4, 4], 4),             1);

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
