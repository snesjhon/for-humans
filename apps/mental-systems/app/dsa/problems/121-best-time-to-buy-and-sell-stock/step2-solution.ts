// =============================================================================
// Best Time to Buy and Sell Stock — Step 2 of 2: Calculating the Best Profit — SOLUTION
// =============================================================================
// Goal: At each house, after updating the cheapest-found note, calculate
//       today's sell profit and update bestProfit if it is a new high.

function maxProfit(prices: number[]): number {
  // ✓ Step 1: Track cheapest buy price seen so far (locked)
  let cheapestFound = Infinity; // sticky note: cheapest buy price on the route
  let bestProfit = 0;           // sticky note: best profit opportunity found

  for (const price of prices) {
    if (price < cheapestFound) {
      cheapestFound = price; // new cheapest find — update buy sticky note
    }
    // Step 2: what if we sold here? — update sell sticky note if better
    const todayProfit = price - cheapestFound;
    if (todayProfit > bestProfit) {
      bestProfit = todayProfit;
    }
  }

  return bestProfit;
}

// Tests — all must print PASS
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
