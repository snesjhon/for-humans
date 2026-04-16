// Goal: Practice recording the running minimum as each plate lands.
//
// For every incoming plate height, report the lowest plate currently on the
// shelf after that drop.
//
// Example:
//   shadowLowestPlate([5, 3, 7, 2]) → [5, 3, 3, 2]
//   shadowLowestPlate([])           → []
function shadowLowestPlate(plates: number[]): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('basic minima', () => shadowLowestPlate([5, 3, 7, 2]), [5, 3, 3, 2]);
test('already rising', () => shadowLowestPlate([1, 2, 3]), [1, 1, 1]);
test('already falling', () => shadowLowestPlate([9, 6, 4]), [9, 6, 4]);
test('single plate', () => shadowLowestPlate([8]), [8]);
test('empty shelf', () => shadowLowestPlate([]), []);
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
