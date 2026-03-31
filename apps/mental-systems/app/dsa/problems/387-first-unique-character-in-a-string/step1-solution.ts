// =============================================================================
// First Unique Character in a String — Step 1 of 2: Tally All the Votes — SOLUTION
// =============================================================================
// Goal: Build a complete vote tally — go through every ballot in the box and
//       count how many times each candidate (character) appears.

function firstUniqChar(s: string): number {
  // Step 1: Build the vote tally — every ballot counted, ledger complete
  const voteTally = new Map<string, number>();
  for (const ballot of s) {
    voteTally.set(ballot, (voteTally.get(ballot) ?? 0) + 1); // add one tally mark
  }

  // Step 2 not yet built — placeholder until we add the auditor scan
  return -1;
}

// Tests — all must print PASS
test('all characters repeat — no sole nominee', () => firstUniqChar('aabb'), -1);
test('single character repeated — no sole nominee', () => firstUniqChar('cccc'), -1);
test('two alternating characters — no sole nominee', () => firstUniqChar('abab'), -1);

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
