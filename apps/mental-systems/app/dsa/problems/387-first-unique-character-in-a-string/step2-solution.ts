// =============================================================================
// First Unique Character in a String — Step 2 of 2: Find the First Sole Nominee — SOLUTION
// =============================================================================
// Goal: With the ledger complete, scan the ballot box left to right and return
//       the index of the first character whose tally shows exactly one vote.

function firstUniqChar(s: string): number {
  // ✓ Step 1: Build the vote tally — one tally mark per ballot cast
  const voteTally = new Map<string, number>();
  for (const ballot of s) {
    voteTally.set(ballot, (voteTally.get(ballot) ?? 0) + 1);
  }

  // Step 2: Auditor scans ballot box in order for the first sole nominee
  for (let i = 0; i < s.length; i++) {
    if (voteTally.get(s[i]) === 1) {
      return i; // sole nominee found — return this position in the box
    }
  }

  return -1; // no candidate received exactly one vote
}

// Tests — all must print PASS
test('first character is the sole nominee', () => firstUniqChar('leetcode'), 0);
test('third character is the sole nominee', () => firstUniqChar('loveleetcode'), 2);
test('single character string — only one ballot', () => firstUniqChar('z'), 0);
test('all characters repeat — no sole nominee', () => firstUniqChar('aabb'), -1);
test('no unique character anywhere', () => firstUniqChar('aabbcc'), -1);

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
