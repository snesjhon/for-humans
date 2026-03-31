// =============================================================================
// Sliding Window — Level 2, Exercise 2: Longest Illuminated Stretch
// =============================================================================
// Goal: Practice variable window with a count-based (not sum-based) constraint.
//
// A corridor has sections lit (1) or dark (0). The historian can flip at
// most maxFlips dark sections to lit ones. Find the longest stretch of
// lit sections she can create by choosing which dark sections to flip.
//
// Return the length of the longest subarray of 1s achievable by flipping
// at most maxFlips zeros.
//
// Example:
//   longestLit([1, 0, 1, 1, 0, 1], 1) → 4  (flip index 1 or index 4 → run of 4)
//   longestLit([0, 0, 1, 1, 0, 0, 1], 0) → 2  (no flips, longest run of 1s is 2)
// =============================================================================
function longestLit(nums: number[], maxFlips: number): number {
  throw new Error('not implemented');
}

test('one flip available',          () => longestLit([1, 0, 1, 1, 0, 1], 1),      4);
test('no flips allowed',            () => longestLit([0, 0, 1, 1, 0, 0, 1], 0),   2);
test('unlimited flips (all zeros)', () => longestLit([0, 0, 0, 0], 4),            4);
test('all ones already',            () => longestLit([1, 1, 1, 1], 0),            4);
test('two flips, gap in middle',    () => longestLit([1, 0, 1, 1, 0, 1, 0, 1], 2), 6);
test('single element zero',         () => longestLit([0], 1),                     1);

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
