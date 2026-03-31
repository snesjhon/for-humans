// =============================================================================
// Minimum Window Substring — Step 1 of 2: Building the Casting Ledger — SOLUTION
// =============================================================================
// Goal: Build the casting ledger (need map) from t, then widen the viewfinder
//       from the right until all required actors are captured — return the first
//       valid window found, or "" if no valid window exists.

function minWindow(s: string, t: string): string {
  // Step 1: Build the casting ledger — how many of each actor type we need
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  const required = need.size;   // number of distinct actor types to satisfy
  const window = new Map<string, number>(); // frame log — tracks actors in viewfinder
  let have = 0;                 // how many actor types are currently fully satisfied

  let l = 0;

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    // Add this actor to the frame log
    window.set(c, (window.get(c) ?? 0) + 1);
    // If this actor is on the sheet AND their count just hit the requirement, mark satisfied
    if (need.has(c) && window.get(c) === need.get(c)) {
      have++;
    }
    // First valid window found — return it (step 1: no contraction yet)
    if (have === required) {
      return s.slice(l, r + 1);
    }
  }

  return ''; // no valid window exists
}

// Tests — all must print PASS
test('no valid window: required actor missing from stage', () => minWindow('A', 'B'), '');
test('no valid window: need two but only one on stage', () => minWindow('A', 'AA'), '');
test('single actor needed and present', () => minWindow('A', 'A'), 'A');
test('exact match: stage is exactly the casting sheet', () => minWindow('ABC', 'ABC'), 'ABC');
test('casting sheet is one actor, appears first on stage', () => minWindow('CADOBEBAN', 'C'), 'C');
test('empty stage', () => minWindow('', 'A'), '');

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
