// Goal: Once a valid window is found, contract from the left to minimize it.
//       Track the best (shortest) valid window across all contraction cycles.

function minWindow(s: string, t: string): string {
  // ✓ Step 1: Build the casting ledger — how many of each actor type we need
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  const required = need.size;
  const window = new Map<string, number>();
  let have = 0;
  let l = 0;

  // Step 2: Track best window boundaries; Infinity sentinel means "not found yet"
  let resLen = Infinity;
  let resL = 0;
  let resR = 0;

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    // Widen: add actor to frame log
    window.set(c, (window.get(c) ?? 0) + 1);
    // If this actor just satisfied a ledger requirement, count it
    if (need.has(c) && window.get(c) === need.get(c)) {
      have++;
    }

    // Tighten: while all required actors are in frame, try to shrink from the left
    while (have === required) {
      // Record this valid window if it's the best so far
      if (r - l + 1 < resLen) {
        resLen = r - l + 1;
        resL = l;
        resR = r;
      }
      // Remove the leftmost actor from the frame
      const leftChar = s[l];
      window.set(leftChar, window.get(leftChar)! - 1);
      // If removing them dropped a required character below the ledger count, window is invalid
      if (need.has(leftChar) && window.get(leftChar)! < need.get(leftChar)!) {
        have--;
      }
      l++;
    }
  }

  return resLen === Infinity ? '' : s.slice(resL, resR + 1);
}

// ---Tests
test('no valid window: required actor missing', () => minWindow('A', 'B'), '');
test('no valid window: need two but only one on stage', () => minWindow('A', 'AA'), '');
test('single actor needed and present', () => minWindow('A', 'A'), 'A');
test('exact match: stage is exactly the casting sheet', () => minWindow('ABC', 'ABC'), 'ABC');
test('classic example — minimum requires contraction', () => minWindow('ADOBECODEBANC', 'ABC'), 'BANC');
test('duplicate requirement — need A twice', () => minWindow('AABC', 'AAB'), 'AAB');
test('minimum window is at the end of stage', () => minWindow('DCBA', 'AB'), 'BA');
test('t is a single repeated character', () => minWindow('AAAB', 'AA'), 'AA');
// ---End Tests

// ---Helpers

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
