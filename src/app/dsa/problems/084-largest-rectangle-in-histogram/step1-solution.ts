// Goal: Start the function with one running best-area tracker.

function largestRectangleArea(heights: number[]): number {
  let largestArea = 0;

  return largestArea;
}

// ---Tests
runCase('empty histogram has area 0', () => largestRectangleArea([]), 0);
runCase('single zero-height bar still has area 0', () => largestRectangleArea([0]), 0);
runCase('all zero bars keep the best area at 0', () => largestRectangleArea([0, 0, 0]), 0);
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
