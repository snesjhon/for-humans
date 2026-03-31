// =============================================================================
// Sliding Window — Level 3, Exercise 1: Longest Passage with Limited Vocabulary — SOLUTION
// =============================================================================
// Goal: Practice variable window with a frequency map — map size as the constraint.
//
// Maintain a map of { char → count } inside the window.
// Expand right: add char to map (or increment its count).
// While map.size > k: remove the leftmost char (decrement count, delete if 0).
// Record window length after each shrink.
// =============================================================================
function longestKDistinct(s: string, k: number): number {
  if (k === 0 || s.length === 0) return 0;

  const have = new Map<string, number>();
  let L = 0;
  let maxLen = 0;

  for (let R = 0; R < s.length; R++) {
    const c = s[R];
    have.set(c, (have.get(c) ?? 0) + 1);

    while (have.size > k) {
      const left = s[L];
      have.set(left, have.get(left)! - 1);
      if (have.get(left) === 0) have.delete(left);
      L++;
    }

    maxLen = Math.max(maxLen, R - L + 1);
  }

  return maxLen;
}

test('two distinct allowed',      () => longestKDistinct('eceba', 2),        3);
test('one distinct allowed',      () => longestKDistinct('aabbcc', 1),       2);
test('entire string qualifies',   () => longestKDistinct('aabbcc', 3),       6);
test('k equals 0',                () => longestKDistinct('abc', 0),          0);
test('empty string',              () => longestKDistinct('', 2),             0);
test('all same characters',       () => longestKDistinct('aaaa', 2),         4);

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
