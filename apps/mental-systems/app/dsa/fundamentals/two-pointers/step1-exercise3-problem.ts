// =============================================================================
// Two Pointers — Level 1, Exercise 3: Count the Light Loads
// =============================================================================
// Goal: Use bulk counting within the two-pointer loop to count valid pairs.
//
// Two inspectors walk a sorted measurement lane. A pair of readings is
// considered a "light load" if their combined value is strictly less than
// a given threshold. Count all such (i, j) pairs where i < j.
//
// Key insight: when nums[L] + nums[R] < target, then nums[L] pairs with
// every element from index L+1 to R — that is (R - L) valid pairs at once.
// Count them all, then advance L.
//
// Example:
//   countPairsLessThan([1, 2, 3, 4, 5], 6) → 4
//   Pairs: (1,2)=3, (1,3)=4, (1,4)=5, (2,3)=5 — all less than 6
// =============================================================================
function countPairsLessThan(nums: number[], target: number): number {
  throw new Error('not implemented');
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
