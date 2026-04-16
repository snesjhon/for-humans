// Goal: Practice span calculation with a monotonic watchlist.
//
// For each checkpoint value, return how many consecutive checkpoints ending at
// that position are less than or equal to the current value.
//
// Example:
//   countOpenSightlines([100, 80, 60, 70, 60, 75, 85]) → [1, 1, 1, 2, 1, 4, 6]
function countOpenSightlines(values: number[]): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('classic span shape', () => countOpenSightlines([100, 80, 60, 70, 60, 75, 85]), [1, 1, 1, 2, 1, 4, 6]);
test('strictly rising', () => countOpenSightlines([10, 20, 30]), [1, 2, 3]);
test('strictly falling', () => countOpenSightlines([30, 20, 10]), [1, 1, 1]);
test('all equal', () => countOpenSightlines([5, 5, 5]), [1, 2, 3]);
test('single checkpoint', () => countOpenSightlines([42]), [1]);
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
// ---End Helpers
