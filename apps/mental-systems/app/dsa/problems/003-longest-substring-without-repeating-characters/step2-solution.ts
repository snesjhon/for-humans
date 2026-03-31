// =============================================================================
// Longest Substring Without Repeating Characters — Step 2 of 2: The Haul Jump — SOLUTION
// =============================================================================
// Goal: Add duplicate detection. When a town is already in the active haul,
// jump haul-start (left) past the last visit.

function lengthOfLongestSubstring(s: string): number {
  // ✓ Step 1: Travel log and scanning loop
  const townLog = new Map<string, number>(); // town → last visited mile marker
  let left = 0;
  let maxHaul = 0;

  for (let right = 0; right < s.length; right++) {
    const town = s[right];

    // Step 2: if this town is in the log AND the visit is inside the active haul,
    // jump haul-start past that old visit (the Math.max prevents moving backwards)
    if (townLog.has(town)) {
      left = Math.max(left, townLog.get(town)! + 1); // leap past last visit
    }

    townLog.set(town, right);                         // always update to current mile
    maxHaul = Math.max(maxHaul, right - left + 1);   // measure the window
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
