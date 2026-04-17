// Goal: Keep shrinking the virtual tape left or right until the decoded cell
//       matches the target or the tape range is exhausted.

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

    throw new Error('not implemented');
  }

  return false;
}

// ---Tests
runCase('empty matrix has no target', () => searchMatrix([], 3), false);
runCase('single cell can match immediately', () => searchMatrix([[7]], 7), true);
runCase('single cell can miss immediately', () => searchMatrix([[7]], 3), false);
runCase('finds a value in the first row', () => searchMatrix([[1, 3, 5], [7, 9, 11]], 3), true);
runCase('finds a value in a later row', () => searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 16), true);
runCase('returns false when the virtual tape is exhausted', () =>
  searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13), false);
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
