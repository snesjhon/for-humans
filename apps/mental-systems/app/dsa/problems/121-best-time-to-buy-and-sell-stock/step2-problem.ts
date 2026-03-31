// =============================================================================
// Best Time to Buy and Sell Stock — Step 2 of 2: Calculating the Best Profit
// =============================================================================
// Goal: At each house, after updating the cheapest-found note, calculate
//       today's sell profit and update bestProfit if it is a new high.
//
// Step 1 (cheapest-buy tracking) is locked inside the function body.

function maxProfit(prices: number[]): number {
  // ✓ Step 1: Track cheapest buy price seen so far (locked)
  let cheapestFound = Infinity;
  let bestProfit = 0;

  for (const price of prices) {
    if (price < cheapestFound) {
      cheapestFound = price;
    }
    // Step 2: calculate profit if we sold here, update bestProfit if better
    throw new Error('not implemented');
  }

  return bestProfit;
}

// Tests
test('empty street', () => maxProfit([]), 0);
test('single house', () => maxProfit([7]), 0);
test('prices only drop', () => maxProfit([7, 6, 4, 3, 1]), 0);
test('buy low sell high', () => maxProfit([7, 1, 5, 3, 6, 4]), 5);
test('only one upward move', () => maxProfit([7, 6, 4, 1, 2]), 1);
test('prices only rise', () => maxProfit([1, 2, 3, 4, 5]), 4);

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
