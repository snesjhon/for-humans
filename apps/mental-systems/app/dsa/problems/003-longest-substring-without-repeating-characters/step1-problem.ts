// =============================================================================
// Longest Substring Without Repeating Characters — Step 1 of 2: Building the Travel Log
// =============================================================================
// Goal: Set up the townLog Map and scan right, recording each town's most recent
// mile marker. Compute maxHaul as the window grows. No jump logic yet — only
// test with strings that have no repeated characters.

function lengthOfLongestSubstring(s: string): number {
  throw new Error('not implemented');
}

// Tests — all unique characters, so haul-start never needs to jump
test('empty string', () => lengthOfLongestSubstring(''), 0);
test('single character', () => lengthOfLongestSubstring('a'), 1);
test('all unique — abc', () => lengthOfLongestSubstring('abc'), 3);
test('all unique — abcde', () => lengthOfLongestSubstring('abcde'), 5);
test('all unique — abcdef', () => lengthOfLongestSubstring('abcdef'), 6);

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
