// Goal: Practice binary branching on a 2D decision space instead of a linear item list.

function countGridPaths(rows: number, cols: number): number {
  if (rows === 1 || cols === 1) return 1;
  return countGridPaths(rows - 1, cols) + countGridPaths(rows, cols - 1);
}

// ---Tests
test('single cell', () => countGridPaths(1, 1), 1);
test('one row only', () => countGridPaths(1, 5), 1);
test('one column only', () => countGridPaths(5, 1), 1);
test('two by two', () => countGridPaths(2, 2), 2);
test('two by three', () => countGridPaths(2, 3), 3);
test('three by three', () => countGridPaths(3, 3), 6);
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
