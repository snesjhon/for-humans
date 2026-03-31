// =============================================================================
// Longest Repeating Character Replacement — Step 1 of 2: Tracking the Dominant Color — SOLUTION
// =============================================================================
// Goal: Set up the 26-slot frequency logbook, slide the right edge forward tile
// by tile, track the dominant color count (maxFreq), and record the frame width
// only when the budget check passes (size - maxFreq <= k). No shrinking yet.

function characterReplacement(s: string, k: number): number {
  const freq = new Array(26).fill(0); // logbook: one slot per color
  let maxFreq = 0;                    // dominant color count in current frame
  let L = 0;                          // left edge of frame (stays at 0 this step)
  let result = 0;                     // widest valid frame seen

  for (let R = 0; R < s.length; R++) {
    const ci = s.charCodeAt(R) - 65; // convert 'A'→0, 'B'→1, ..., 'Z'→25
    freq[ci]++;                       // new tile enters — update logbook
    maxFreq = Math.max(maxFreq, freq[ci]); // is this the new dominant color?

    // Budget check: tiles to repaint = frame size - dominant count
    if (R - L + 1 - maxFreq <= k) {
      result = Math.max(result, R - L + 1);
    }
  }

  return result;
}

// Tests — all must print PASS
test('empty string', () => characterReplacement('', 0), 0);
test('single tile', () => characterReplacement('A', 5), 1);
test('all same color — no repaints needed', () => characterReplacement('AAAA', 0), 4);
test('two colors, budget covers all minorities', () => characterReplacement('AABB', 2), 4);
test('large budget, whole wall valid', () => characterReplacement('ABCD', 3), 4);

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
