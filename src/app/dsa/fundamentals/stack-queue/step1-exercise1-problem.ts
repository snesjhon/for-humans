// Goal: Practice pure LIFO behavior by reversing a plate shelf.
//
// Plates come off one shelf and must be rebuilt onto a fresh shelf.
// The only rule: you may lift from the top of the working shelf.
// Return the rebuilt shelf from top to bottom order as an array.
//
// Example:
//   restackPlates([3, 1, 4]) → [4, 1, 3]
//   restackPlates([])        → []
function restackPlates(plates: number[]): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('three plates', () => restackPlates([3, 1, 4]), [4, 1, 3]);
test('single plate', () => restackPlates([7]), [7]);
test('empty shelf', () => restackPlates([]), []);
test('repeated plates', () => restackPlates([2, 2, 2]), [2, 2, 2]);
test('descending shelf', () => restackPlates([5, 4, 3, 2]), [2, 3, 4, 5]);
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
