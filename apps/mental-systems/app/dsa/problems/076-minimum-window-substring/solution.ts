// =============================================================================
// Minimum Window Substring — Complete Solution
// =============================================================================

function minWindow(s: string, t: string): string {
  // Build the casting ledger — how many of each actor type we need
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  const required = need.size;          // number of distinct actor types to satisfy
  const window = new Map<string, number>(); // frame log — all actors currently in viewfinder
  let have = 0;                        // actor types whose count meets the ledger
  let l = 0;

  let resLen = Infinity;               // best window length seen (Infinity = not found)
  let resL = 0;
  let resR = 0;

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    // Widen: pull this actor into the viewfinder
    window.set(c, (window.get(c) ?? 0) + 1);
    // Check if this actor just satisfied a ledger requirement
    if (need.has(c) && window.get(c) === need.get(c)) {
      have++;
    }

    // Tighten: while the shot is valid, shrink from the left
    while (have === required) {
      // Record best window before attempting to shrink further
      if (r - l + 1 < resLen) {
        resLen = r - l + 1;
        resL = l;
        resR = r;
      }
      // Remove leftmost actor from the frame
      const leftChar = s[l];
      window.set(leftChar, window.get(leftChar)! - 1);
      // If removal broke a requirement, the shot is invalid
      if (need.has(leftChar) && window.get(leftChar)! < need.get(leftChar)!) {
        have--;
      }
      l++;
    }
  }

  return resLen === Infinity ? '' : s.slice(resL, resR + 1);
}

// Tests — all must print PASS
test('no valid window: required actor missing', () => minWindow('A', 'B'), '');
test('no valid window: need two but only one on stage', () => minWindow('A', 'AA'), '');
test('single actor needed and present', () => minWindow('A', 'A'), 'A');
test('exact match: stage is exactly the casting sheet', () => minWindow('ABC', 'ABC'), 'ABC');
test('classic example — minimum requires contraction', () => minWindow('ADOBECODEBANC', 'ABC'), 'BANC');
test('duplicate requirement — need A twice', () => minWindow('AABC', 'AAB'), 'AAB');
test('minimum window is at the end of stage', () => minWindow('DCBA', 'AB'), 'BA');
test('t is a single repeated character', () => minWindow('AAAB', 'AA'), 'AA');
test('empty stage', () => minWindow('', 'A'), '');
test('s equals t exactly', () => minWindow('a', 'a'), 'a');

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
