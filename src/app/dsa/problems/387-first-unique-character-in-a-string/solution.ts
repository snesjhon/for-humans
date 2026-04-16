// =============================================================================
// First Unique Character in a String — Complete Solution
// =============================================================================
// Two-pass approach: count all votes first, then scan for the first sole nominee.

function firstUniqChar(s: string): number {
  // Pass 1: Vote counter fills the ledger — one tally mark per ballot
  const voteTally = new Map<string, number>();
  for (const ballot of s) {
    voteTally.set(ballot, (voteTally.get(ballot) ?? 0) + 1);
  }

  // Pass 2: Auditor scans the ballot box left to right for the first sole nominee
  for (let i = 0; i < s.length; i++) {
    if (voteTally.get(s[i]) === 1) {
      return i; // first candidate with exactly 1 vote — return their position
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
test('unique character at the end', () => firstUniqChar('aabbc'), 4);
test('entire string is one character', () => firstUniqChar('aaaa'), -1);

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
