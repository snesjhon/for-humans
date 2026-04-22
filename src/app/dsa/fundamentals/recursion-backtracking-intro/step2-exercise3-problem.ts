// Goal: Practice binary branching on a 2D decision space instead of a linear item list.
//
// The guide starts at the top-left of a rows×cols grid and must reach the
// bottom-right corner by moving only right or down. At each position fork into two
// scouts: one moves right, one moves down. Positions on the right or bottom edge
// have only one valid direction. The base fires when both dimensions reach 1
// — exactly one route exists from a 1×1 cell.
//
// Example:
//   countGridPaths(2, 2)  → 2
//   countGridPaths(3, 3)  → 6

function countGridPaths(rows: number, cols: number): number {
  throw new Error('not implemented');
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
