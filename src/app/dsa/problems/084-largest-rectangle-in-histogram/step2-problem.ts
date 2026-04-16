// Goal: Add the open-permit stack and close every surviving rectangle against
// the right edge of the histogram.

function largestRectangleArea(heights: number[]): number {
  let largestArea = 0;
  throw new Error('not implemented');
}

// ---Tests
runCase('empty histogram has area 0', () => largestRectangleArea([]), 0);
runCase('single bar uses its own width 1 rectangle', () => largestRectangleArea([7]), 7);
runCase('rising bars can all be closed at the right edge', () => largestRectangleArea([2, 3, 4]), 6);
runCase('flat bars combine into one wider rectangle', () => largestRectangleArea([2, 2, 2]), 6);
// ---End Tests

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers
