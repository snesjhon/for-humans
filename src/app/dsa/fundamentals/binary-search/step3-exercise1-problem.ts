// =============================================================================
// Binary Search — Level 3, Exercise 1: Calibrate the Smallest Daily Load
// =============================================================================
// Goal: Search the rail of possible capacities and keep the smallest one that works.
//
// A loader ships packages in order. Each day can carry at most one chosen capacity.
// Return the smallest capacity that finishes all loads within the given number of days.
//
// Example:
//   minimumDailyLoad([3, 2, 2, 4, 1, 4], 3) → 6
//   minimumDailyLoad([5, 5, 5], 2)          → 10
// =============================================================================
function minimumDailyLoad(loads: number[], days: number): number {
  throw new Error('not implemented');
}

test('sample capacity split', () => minimumDailyLoad([3, 2, 2, 4, 1, 4], 3), 6);
test('two-day split', () => minimumDailyLoad([5, 5, 5], 2), 10);
test('one day needs total sum', () => minimumDailyLoad([2, 3, 7], 1), 12);
test('one load per day uses max load', () => minimumDailyLoad([2, 3, 7], 3), 7);
test('single load rail', () => minimumDailyLoad([9], 4), 9);
test('larger mixed loads', () => minimumDailyLoad([7, 2, 5, 10, 8], 2), 18);

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
// ---End Helpers
