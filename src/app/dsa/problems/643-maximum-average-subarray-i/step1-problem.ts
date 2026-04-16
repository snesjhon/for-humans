// Goal: Sum the first k performers to light up the initial spotlight window,
//       then return that window's average as the first (and only) candidate.

function findMaxAverage(nums: number[], k: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('single performer', () => findMaxAverage([5], 1), 5);
test('two performers, equal', () => findMaxAverage([3, 3], 2), 3);
test('two performers, unequal', () => findMaxAverage([2, 4], 2), 3);
test('three performers', () => findMaxAverage([2, 4, 6], 3), 4);
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
