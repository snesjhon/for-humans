// =============================================================================
// 3Sum — Step 1 of 2: Sort the Ledger and Pin the Anchor — SOLUTION
// =============================================================================
// Goal: Sort a copy of nums (the ledger), then scan an anchor from left to right,
// applying the early-exit (anchor > 0) and duplicate-skip rules.

function threeSum(nums: number[]): number[][] {
  // Sort the ledger: largest expense (most negative) on left, largest income on right
  const ledger = [...nums].sort((a, b) => a - b);
  const triplets: number[][] = [];

  for (let i = 0; i < ledger.length - 2; i++) {
    // All remaining entries are positive — three positives can never sum to zero
    if (ledger[i] > 0) break;
    // Same anchor value as last round — would produce identical triplets, skip
    if (i > 0 && ledger[i] === ledger[i - 1]) continue;
    // Step 2: inner squeeze goes here
  }

  return triplets;
}

// Tests — all must print PASS
test('empty ledger returns no triplets', () => threeSum([]), []);
test('all-positive entries — break immediately', () => threeSum([1, 2, 3]), []);

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
