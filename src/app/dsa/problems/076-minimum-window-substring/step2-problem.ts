// Goal: Once a valid window is found, contract from the left to minimize it.
//       Track the best (shortest) valid window across all contraction cycles.

function minWindow(s: string, t: string): string {
  // ✓ Step 1: Build the casting ledger (locked)
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  const required = need.size;
  const window = new Map<string, number>();
  let have = 0;
  let l = 0;

  throw new Error('not implemented');
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
