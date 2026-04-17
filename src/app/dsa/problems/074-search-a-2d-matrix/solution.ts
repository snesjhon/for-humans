// Goal: Search the 2D matrix in O(log(m * n)) by treating it like one sorted
//       tape and decoding each midpoint back into a row and column.

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

    if (value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
}

// ---Tests
runCase(
  'example 1: target 3 is present',
  () => searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3),
  true,
);
runCase(
  'example 2: target 13 is missing',
  () => searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13),
  false,
);
runCase('finds the first flattened position', () => searchMatrix([[1, 4, 7]], 1), true);
runCase('finds the last flattened position', () => searchMatrix([[1, 4], [7, 10]], 10), true);
runCase('handles a single-cell miss', () => searchMatrix([[5]], 2), false);
runCase('handles an empty matrix', () => searchMatrix([], 9), false);
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
