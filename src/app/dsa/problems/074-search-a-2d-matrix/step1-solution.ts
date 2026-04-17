// Goal: Treat the matrix as one sorted tape, decode the midpoint cell, and
//       return true only when that first decoded cell is the target.

function searchMatrix(matrix: number[][], target: number): boolean {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;
  let left = 0;
  let right = rows * cols - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = Math.floor(mid / cols);
    const col = mid % cols;
    const value = matrix[row][col];

    if (value === target) {
      return true;
    }

    return false;
  }

  return false;
}

// ---Tests
runCase('empty matrix has no target', () => searchMatrix([], 3), false);
runCase('single cell can match immediately', () => searchMatrix([[7]], 7), true);
runCase('single cell can miss immediately', () => searchMatrix([[7]], 3), false);
runCase('first decoded midpoint can hit exactly', () => searchMatrix([[1, 3, 5], [7, 9, 11]], 5), true);
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
