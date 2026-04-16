// Goal: Close taller open rectangles as soon as a shorter bar blocks them.

function largestRectangleArea(heights: number[]): number {
  let largestArea = 0;
  const openRectangles: Array<{ start: number; height: number }> = [];

  for (let index = 0; index < heights.length; index++) {
    const start = index;
    throw new Error('not implemented');
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
runCase('single bar still uses width 1', () => largestRectangleArea([7]), 7);
runCase('rising bars still close at the right edge', () => largestRectangleArea([2, 3, 4]), 6);
runCase('prompt example already finds the 5x2 rectangle', () => largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
runCase('a drop can close one tall rectangle while an earlier short one stays open', () => largestRectangleArea([2, 4, 2]), 6);
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
