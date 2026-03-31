// =============================================================================
// Sliding Window — Level 3, Exercise 3: Count Rich-Vocabulary Passages — SOLUTION
// =============================================================================
// Goal: Practice the "exactly k" pattern by combining two at-most-k window scans.
//
// atMostK(s, k): count substrings with at most k distinct chars.
//   For each R, after shrinking, there are (R - L + 1) valid substrings ending at R.
//   Sum these up across all R positions.
//
// exactlyK(s, k) = atMostK(s, k) - atMostK(s, k - 1)
// =============================================================================
function countExactK(s: string, k: number): number {
  if (k <= 0) return 0;
  return atMostK(s, k) - atMostK(s, k - 1);
}

function atMostK(s: string, k: number): number {
  if (k < 0) return 0;
  const have = new Map<string, number>();
  let L = 0;
  let count = 0;

  for (let R = 0; R < s.length; R++) {
    const c = s[R];
    have.set(c, (have.get(c) ?? 0) + 1);
    while (have.size > k) {
      const left = s[L];
      have.set(left, have.get(left)! - 1);
      if (have.get(left) === 0) have.delete(left);
      L++;
    }
    count += R - L + 1;
  }

  return count;
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
