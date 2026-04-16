// =============================================================================
// Recursion & Backtracking Intro — Level 2, Exercise 3: Tile the Valley Floor
// =============================================================================
// Goal: Count the number of ways to tile a 2×n board using 2×1 dominoes.
//       Each step of the mountain reduces the board by one column — place a
//       vertical domino (uses 1 column) or a pair of horizontals (uses 2).
//
// Recurrence (two sub-peaks branching at every step):
//   tileDomino(0) = 1  (empty board: one way — do nothing)
//   tileDomino(1) = 1  (one column: only vertical fits)
//   tileDomino(n) = tileDomino(n-1) + tileDomino(n-2)
//
// The summit log (memo) is required — without it, the same board size is
// solved repeatedly as the call tree branches.
//
// Example:
//   tileDomino(2) → 2   (two verticals, or two horizontals stacked)
//   tileDomino(4) → 5
//   tileDomino(10) → 89
// =============================================================================
function tileDomino(n: number, memo: Map<number, number> = new Map()): number {
  throw new Error('not implemented');
}

test('empty board: n=0 → 1', () => tileDomino(0), 1);
test('one column: n=1 → 1', () => tileDomino(1), 1);
test('n=2 → 2', () => tileDomino(2), 2);
test('n=3 → 3', () => tileDomino(3), 3);
test('n=4 → 5', () => tileDomino(4), 5);
test('n=5 → 8', () => tileDomino(5), 8);
test('n=10 → 89', () => tileDomino(10), 89);

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
