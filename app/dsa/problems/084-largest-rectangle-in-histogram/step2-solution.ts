// Goal: Add the open-permit stack and close every surviving rectangle against
// the right edge of the histogram.

function largestRectangleArea(heights: number[]): number {
  let largestArea = 0;
  const openRectangles: Array<{ start: number; height: number }> = [];

  for (let index = 0; index < heights.length; index++) {
    openRectangles.push({ start: index, height: heights[index] });
  }

  for (const openRectangle of openRectangles) {
    const area = openRectangle.height * (heights.length - openRectangle.start);
    if (area > largestArea) {
      largestArea = area;
    }
  }

  return largestArea;
}

// ---Tests
runCase('empty histogram has area 0', () => largestRectangleArea([]), 0);
runCase('single bar uses its own width 1 rectangle', () => largestRectangleArea([7]), 7);
runCase('rising bars can all be closed at the right edge', () => largestRectangleArea([2, 3, 4]), 6);
runCase('flat bars combine into one wider rectangle', () => largestRectangleArea([2, 2, 2]), 6);
// ---End Tests

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
