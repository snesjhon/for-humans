// Goal: Sort a copy of nums (the ledger), then scan an anchor from left to right,
// applying the early-exit (anchor > 0) and duplicate-skip rules.

function threeSum(nums: number[]): number[][] {
  throw new Error('not implemented');
}

// ---Tests
test('empty ledger returns no triplets', () => threeSum([]), []);
test('all-positive entries — break immediately', () => threeSum([1, 2, 3]), []);
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
