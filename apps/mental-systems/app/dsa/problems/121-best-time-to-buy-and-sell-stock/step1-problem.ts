// =============================================================================
// Best Time to Buy and Sell Stock — Step 1 of 2: Tracking the Cheapest Buy
// =============================================================================
// Goal: Walk through the garage sale prices and keep a sticky note of the
//       cheapest price seen so far. Return bestProfit (stays 0 in this step).

function maxProfit(prices: number[]): number {
  throw new Error('not implemented');
}

// Tests — calibrated to cases where tracking the minimum alone gives the correct answer
test('empty street — no houses to visit', () => maxProfit([]), 0);
test('single house — nothing to sell after buying', () => maxProfit([7]), 0);
test('prices only drop — no profitable sale exists', () => maxProfit([7, 6, 4, 3, 1]), 0);

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
