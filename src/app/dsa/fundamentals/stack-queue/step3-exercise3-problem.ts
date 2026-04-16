// Goal: Practice fleet-style compression after sorting by position.
//
// Cars move toward the same target. A faster car that catches a slower car
// before the target becomes part of the same convoy.
// Return how many convoys reach the target.
//
// Example:
//   countConvoys(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) → 3
function countConvoys(target: number, positions: number[], speeds: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('classic convoy case', () => countConvoys(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]), 3);
test('single car', () => countConvoys(10, [3], [2]), 1);
test('no merges', () => countConvoys(10, [0, 4, 8], [1, 1, 1]), 3);
test('all merge into one', () => countConvoys(10, [0, 2, 4], [4, 2, 1]), 1);
test('same arrival time merges', () => countConvoys(10, [6, 8], [2, 1]), 1);
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
