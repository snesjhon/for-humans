// Goal: Treat the matrix as one sorted tape, decode the midpoint cell, and
//       return true only when that first decoded cell is the target.

function searchMatrix(matrix: number[][], target: number): boolean {
  throw new Error('not implemented');
}

// ---Tests
runCase('empty matrix has no target', () => searchMatrix([], 3), false);
runCase('single cell can match immediately', () => searchMatrix([[7]], 7), true);
runCase('single cell can miss immediately', () => searchMatrix([[7]], 3), false);
runCase('first decoded midpoint can hit exactly', () => searchMatrix([[1, 3, 5], [7, 9, 11]], 5), true);
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
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw e;
    }
  }
}
// ---End Helpers
