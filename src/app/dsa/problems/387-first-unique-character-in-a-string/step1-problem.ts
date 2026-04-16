// Goal: Build a complete vote tally — go through every ballot in the box and
//       count how many times each candidate (character) appears. The ledger
//       must be fully complete before any decision can be made.

function firstUniqChar(s: string): number {
  // Your task: build the vote tally ledger.
  // For each ballot (character) in the string:
  //   - if the candidate isn't in the ledger yet, add them with count 1
  //   - if the candidate is already in the ledger, increment their count
  // After counting, return -1 as a placeholder (step 2 will use the ledger).
  throw new Error('not implemented');
}

// with just a tally and no scan logic yet.
// ---Tests
test('all characters repeat — no sole nominee', () => firstUniqChar('aabb'), -1);
test('single character repeated — no sole nominee', () => firstUniqChar('cccc'), -1);
test('two alternating characters — no sole nominee', () => firstUniqChar('abab'), -1);
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
