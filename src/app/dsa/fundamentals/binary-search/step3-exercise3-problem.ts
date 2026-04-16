// =============================================================================
// Binary Search — Level 3, Exercise 3: Calibrate the Smallest Reading Rate
// =============================================================================
// Goal: Keep the smallest rate whose pass/fail test finishes the reading plan on time.
//
// A reader must finish each chapter in order. At speed rate, one hour covers
// at most rate pages from a single chapter, so each chapter costs ceil(pages / rate) hours.
// Return the smallest rate that finishes all chapters within hours.
//
// Example:
//   minimumReadingRate([30, 11, 23, 4, 20], 6) → 23
//   minimumReadingRate([12, 8, 6], 5)          → 6
// =============================================================================
function minimumReadingRate(chapters: number[], hours: number): number {
  throw new Error('not implemented');
}

test('sample reading plan', () => minimumReadingRate([30, 11, 23, 4, 20], 6), 23);
test('exactly enough time at max chapter', () => minimumReadingRate([12, 8, 6], 5), 6);
test('one chapter per hour', () => minimumReadingRate([5, 9, 7], 3), 9);
test('more time allows slower rate', () => minimumReadingRate([5, 9, 7], 6), 5);
test('single chapter', () => minimumReadingRate([15], 4), 4);
test('uniform chapters', () => minimumReadingRate([8, 8, 8, 8], 8), 4);

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
