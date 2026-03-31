// =============================================================================
// Two Pointers — Level 1, Exercise 3: Count the Light Loads — SOLUTION
// =============================================================================
// Goal: Use bulk counting within the two-pointer loop to count valid pairs.
//
// When nums[L] + nums[R] < target, every element between L+1 and R pairs
// with nums[L] to produce a valid sum (they are all <= nums[R] since sorted).
// Count all (R - L) pairs at once, then advance L to the next candidate.
// When the sum is >= target, move R left to reduce the sum.
// =============================================================================
function countPairsLessThan(nums: number[], target: number): number {
  let L = 0, R = nums.length - 1;
  let count = 0;
  while (L < R) {
    if (nums[L] + nums[R] < target) {
      count += R - L; // nums[L] pairs validly with every element from L+1 to R
      L++;
    } else {
      R--;
    }
  }
  return count;
}

test('basic case',          () => countPairsLessThan([1, 2, 3, 4, 5], 6),  4);
test('all pairs qualify',   () => countPairsLessThan([1, 1, 1, 1],    3),  6);
test('no pairs qualify',    () => countPairsLessThan([3, 4, 5],        5),  0);
test('empty array',         () => countPairsLessThan([],               5),  0);
test('two elements',        () => countPairsLessThan([1, 4],           6),  1);
test('negative numbers',    () => countPairsLessThan([-3, 0, 2, 5],   4),  4);

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
