// =============================================================================
// Sliding Window — Level 3, Exercise 3: Count Rich-Vocabulary Passages
// =============================================================================
// Goal: Practice the "exactly k" pattern by combining two at-most-k window scans.
//
// A "rich-vocabulary" passage uses exactly k distinct characters — not fewer,
// not more. Count how many substrings (contiguous passages) of s use exactly
// k distinct characters.
//
// Key insight: count(exactly k) = count(at most k) − count(at most k−1).
// Implement a helper that counts substrings with at most k distinct chars,
// then call it twice.
//
// Return the number of substrings with exactly k distinct characters.
// Return 0 if k <= 0.
//
// Example:
//   countExactK("abc", 2) → 2  (substrings "ab" and "bc")
//   countExactK("aab", 1) → 3  (substrings "a","a","aa" — wait: "a"=1, "a"=1, "aa"=1 → 3)
//
// Explanation for "aab" with k=1:
//   Substrings with exactly 1 distinct: "a"(0), "a"(1), "b"(2), "aa"(0-1) = 4
//   atMost(1) = 4, atMost(0) = 0 → exactly 1 = 4 − 0 = 4
// =============================================================================
function countExactK(s: string, k: number): number {
  throw new Error('not implemented');
}

test('basic two-char distinct',   () => countExactK('abc', 2),      2);
test('one distinct in "aab"',     () => countExactK('aab', 1),      4);
test('two distinct in "aab"',     () => countExactK('aab', 2),      2);
test('all same chars',            () => countExactK('aaaa', 1),     10);
test('k equals 0',                () => countExactK('abc', 0),      0);
test('k larger than distinct',    () => countExactK('ab', 3),       0);

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
