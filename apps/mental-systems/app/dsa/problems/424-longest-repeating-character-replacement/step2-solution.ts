// =============================================================================
// Longest Repeating Character Replacement — Step 2 of 2: The Budget Reset — SOLUTION
// =============================================================================
// Goal: When the frame exceeds budget (size - maxFreq > k), slide the left edge
// one step right (remove that tile from the logbook, advance L). After the
// optional slide, always record R - L + 1 as a candidate for the best width.

function characterReplacement(s: string, k: number): number {
  // ✓ Step 1: Build the frequency logbook and track dominant color (locked)
  const freq = new Array(26).fill(0);
  let maxFreq = 0;
  let L = 0;
  let result = 0;

  for (let R = 0; R < s.length; R++) {
    const ci = s.charCodeAt(R) - 65;
    freq[ci]++;
    maxFreq = Math.max(maxFreq, freq[ci]); // maxFreq only ever goes up

    // Step 2: Over budget? Slide the left edge one step (never more than one)
    if (R - L + 1 - maxFreq > k) {
      freq[s.charCodeAt(L) - 65]--; // remove leftmost tile from logbook
      L++;                           // slide left edge right
    }

    // Frame is now at most as wide as the best seen — always a valid candidate
    result = Math.max(result, R - L + 1);
  }

  return result;
}

// Tests — all must print PASS
test('empty string', () => characterReplacement('', 0), 0);
test('all same color', () => characterReplacement('AAAA', 0), 4);
test('budget covers whole wall', () => characterReplacement('AABB', 2), 4);
test('slide needed — dominant cluster in the middle', () => characterReplacement('BAAAB', 0), 3);
test('slide needed — alternating', () => characterReplacement('ABAB', 1), 3);
test('LeetCode example 1', () => characterReplacement('ABAB', 2), 4);
test('LeetCode example 2', () => characterReplacement('AABABBA', 1), 4);

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
