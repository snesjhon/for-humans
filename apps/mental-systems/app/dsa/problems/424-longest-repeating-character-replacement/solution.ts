// =============================================================================
// Longest Repeating Character Replacement — Complete Solution
// =============================================================================
// The Paint Crew Frame: slide a frame across the wall of tiles. Track the
// dominant color count (maxFreq). When repaints needed exceed budget k, slide
// the left edge one step. Always record the frame width after any adjustment.

function characterReplacement(s: string, k: number): number {
  const freq = new Array(26).fill(0); // logbook: frequency of each color in frame
  let maxFreq = 0;                    // dominant color count — only ever goes up
  let L = 0;                          // left edge of the paint crew's frame
  let result = 0;                     // widest valid frame seen

  for (let R = 0; R < s.length; R++) {
    const ci = s.charCodeAt(R) - 65; // 'A'→0, 'B'→1, ..., 'Z'→25
    freq[ci]++;                       // new tile joins the frame
    maxFreq = Math.max(maxFreq, freq[ci]); // update dominant color count

    // If repaints needed > budget: slide the left edge one step to the right
    if (R - L + 1 - maxFreq > k) {
      freq[s.charCodeAt(L) - 65]--; // leftmost tile leaves the frame
      L++;                           // frame shrinks from the left by one
    }

    // Frame is always a valid-width candidate after the optional slide
    result = Math.max(result, R - L + 1);
  }

  return result;
}

// Tests — all must print PASS
test('empty string', () => characterReplacement('', 0), 0);
test('single tile', () => characterReplacement('A', 5), 1);
test('all same, zero budget', () => characterReplacement('AAAA', 0), 4);
test('two colors, budget covers all', () => characterReplacement('AABB', 2), 4);
test('dominant cluster mid-string', () => characterReplacement('BAAAB', 0), 3);
test('alternating, k=1', () => characterReplacement('ABAB', 1), 3);
test('LeetCode example 1: ABAB k=2', () => characterReplacement('ABAB', 2), 4);
test('LeetCode example 2: AABABBA k=1', () => characterReplacement('AABABBA', 1), 4);
test('single char string', () => characterReplacement('Z', 0), 1);
test('all different, large k', () => characterReplacement('ABCDE', 4), 5);

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
