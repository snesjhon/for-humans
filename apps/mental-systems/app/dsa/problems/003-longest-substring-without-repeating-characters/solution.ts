// =============================================================================
// Longest Substring Without Repeating Characters — Complete Solution
// =============================================================================

function lengthOfLongestSubstring(s: string): number {
  const townLog = new Map<string, number>(); // town name → most recent mile marker
  let left = 0;                              // haul-start: where active collection begins
  let maxHaul = 0;                           // biggest unique haul ever seen

  for (let right = 0; right < s.length; right++) {
    const town = s[right];

    // If this town is in the log, jump haul-start past its last visit.
    // Math.max prevents jumping backwards when the log entry is stale (before left).
    if (townLog.has(town)) {
      left = Math.max(left, townLog.get(town)! + 1);
    }

    townLog.set(town, right);                       // update log to current mile
    maxHaul = Math.max(maxHaul, right - left + 1); // measure active haul
  }

  return maxHaul;
}

// Tests — all must print PASS
test('empty string', () => lengthOfLongestSubstring(''), 0);
test('single character', () => lengthOfLongestSubstring('a'), 1);
test('all unique — abc', () => lengthOfLongestSubstring('abc'), 3);
test('all repeated — bbbbb', () => lengthOfLongestSubstring('bbbbb'), 1);
test('classic — abcabcbb', () => lengthOfLongestSubstring('abcabcbb'), 3);
test('classic — pwwkew', () => lengthOfLongestSubstring('pwwkew'), 3);
test('stale log check — dvdf', () => lengthOfLongestSubstring('dvdf'), 3);
test('two chars — au', () => lengthOfLongestSubstring('au'), 2);
test('repeat at start — aab', () => lengthOfLongestSubstring('aab'), 2);

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
