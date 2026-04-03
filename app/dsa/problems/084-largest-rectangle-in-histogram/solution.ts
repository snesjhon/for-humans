// Goal: Keep a monotonic stack of open rectangles, closing taller heights on a
// drop and letting the new shorter height inherit the earliest valid start.

function largestRectangleArea(heights: number[]): number {
  let largestArea = 0;
  const openRectangles: Array<{ start: number; height: number }> = [];

  for (let index = 0; index < heights.length; index++) {
    let start = index;

    while (
      openRectangles.length > 0 &&
      openRectangles[openRectangles.length - 1].height > heights[index]
    ) {
      const closedRectangle = openRectangles.pop()!;
      const area = closedRectangle.height * (index - closedRectangle.start);
      if (area > largestArea) {
        largestArea = area;
      }
      start = closedRectangle.start; // the shorter current bar can still span every column the taller bar already proved safe
    }

    openRectangles.push({ start, height: heights[index] });
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
runCase('example 1', () => largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
runCase('example 2', () => largestRectangleArea([2, 4]), 4);
runCase('empty histogram returns 0', () => largestRectangleArea([]), 0);
runCase('valley bar can span both neighbors', () => largestRectangleArea([2, 1, 2]), 3);
runCase('strictly descending bars still find the widest middle rectangle', () => largestRectangleArea([4, 3, 2, 1]), 6);
runCase('flat bars combine into one wide rectangle', () => largestRectangleArea([2, 2, 2]), 6);
runCase('zero-height bars split the histogram into separate regions', () => largestRectangleArea([4, 2, 0, 3, 2, 5]), 6);
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
