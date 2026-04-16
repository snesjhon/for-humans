// Goal: Let the current shorter bar inherit the earliest left boundary from the
// taller rectangles it closes.

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
      start = closedRectangle.start; // a shorter roof can reuse every left support the taller roof already had
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
runCase('valley bar can span both neighbors', () => largestRectangleArea([2, 1, 2]), 3);
runCase('prompt example', () => largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
runCase('wide short rectangle can beat taller local bars', () => largestRectangleArea([4, 2, 0, 3, 2, 5]), 6);
runCase('a lower bar can inherit width across equal-height neighbors too', () => largestRectangleArea([2, 2, 1, 2]), 4);
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
