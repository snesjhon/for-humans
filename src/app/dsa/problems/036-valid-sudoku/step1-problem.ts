// Goal: Create three families of nine logbooks (Sets) and walk every unit in
//       the building, skipping vacant '.' cells. A fully vacant board returns true.

function isValidSudoku(board: string[][]): boolean {
  throw new Error('not implemented');
}

function makeBoard(overrides: [number, number, string][]): string[][] {
  const b: string[][] = Array.from({length: 9}, () => Array<string>(9).fill('.'));
  for (const [r, c, v] of overrides) b[r][c] = v;
  return b;
}

// ---Tests
test('empty board (all dots) is valid', () => isValidSudoku(makeBoard([])), true);
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
