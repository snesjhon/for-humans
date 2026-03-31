// =============================================================================
// Minimum Window Substring — Step 1 of 2: Building the Casting Ledger
// =============================================================================
// Goal: Build the casting ledger (need map) from t, then widen the viewfinder
//       from the right until all required actors are captured — return the first
//       valid window found, or "" if no valid window exists.

function minWindow(s: string, t: string): string {
  throw new Error('not implemented');
}

// Tests — step 1 only handles cases where contraction isn't needed
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
