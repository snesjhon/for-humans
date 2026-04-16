// Goal: With the ledger complete, scan the ballot box left to right and return
//       the index of the first character whose tally shows exactly one vote.
//       If no such character exists, return -1.

function firstUniqChar(s: string): number {
  // ✓ Step 1: Build the vote tally — every ballot counted (locked)
  const voteTally = new Map<string, number>();
  for (const ballot of s) {
    voteTally.set(ballot, (voteTally.get(ballot) ?? 0) + 1);
  }

  // Step 2: Auditor scans the ballot box for the first sole nominee.
  // Go through each position i in the string.
  // If the candidate at s[i] has exactly 1 vote in the ledger, return i.
  // If no sole nominee is found, return -1.
  throw new Error('not implemented');
}

// ---Tests
test('first character is the sole nominee', () => firstUniqChar('leetcode'), 0);
test('third character is the sole nominee', () => firstUniqChar('loveleetcode'), 2);
test('single character string — only one ballot', () => firstUniqChar('z'), 0);
test('all characters repeat — no sole nominee', () => firstUniqChar('aabb'), -1);
test('no unique character anywhere', () => firstUniqChar('aabbcc'), -1);
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
