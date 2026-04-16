// Goal: For each occupied unit, compute its wing index, check all three
//       logbooks for the resident number, and record it if no duplicate found.

function isValidSudoku(board: string[][]): boolean {
  // ✓ Step 1: Twenty-seven logbooks — one per floor, one per column, one per wing
  const rowBooks = Array.from({length: 9}, () => new Set<string>());
  const colBooks = Array.from({length: 9}, () => new Set<string>());
  const wingBooks = Array.from({length: 9}, () => new Set<string>());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const resident = board[r][c];
      if (resident === '.') continue; // vacant unit — skip

      // Step 2: Which wing does this unit belong to?
      const wingIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      // Step 2: Check all three logbooks — any match is a violation
      if (
        rowBooks[r].has(resident) ||
        colBooks[c].has(resident) ||
        wingBooks[wingIdx].has(resident)
      ) {
        return false; // duplicate found
      }

      // Step 2: All clear — record in every logbook
      rowBooks[r].add(resident);
      colBooks[c].add(resident);
      wingBooks[wingIdx].add(resident);
    }
  }

  return true;
}

function makeBoard(overrides: [number, number, string][]): string[][] {
  const b: string[][] = Array.from({length: 9}, () => Array<string>(9).fill('.'));
  for (const [r, c, v] of overrides) b[r][c] = v;
  return b;
}

const validBoard: string[][] = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".",".","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"],
];

// ---Tests
test('empty board (all dots) is valid', () => isValidSudoku(makeBoard([])), true);
test('valid sudoku board', () => isValidSudoku(validBoard), true);
test('invalid: duplicate in row', () => isValidSudoku(makeBoard([[0,0,'1'],[0,1,'1']])), false);
test('invalid: duplicate in column', () => isValidSudoku(makeBoard([[0,0,'1'],[1,0,'1']])), false);
test('invalid: duplicate in box', () => isValidSudoku(makeBoard([[0,0,'1'],[2,2,'1']])), false);
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
