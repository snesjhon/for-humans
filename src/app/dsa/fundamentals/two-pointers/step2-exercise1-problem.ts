// Goal: Practice the greedy gate — move the shorter wall, track the max.
//
// Two surveyors stand at opposite ends of a valley. Each position holds
// a wall of a given height. The amount of water a pair of walls can hold
// equals the shorter wall's height multiplied by the distance between them.
// Find the pair of walls that holds the most water.
//
// At each step: compute the area for the current pair, update the max,
// then move the surveyor at the SHORTER wall inward (that is the gate).
//
// Example:
//   maxContainerArea([3, 1, 5, 2, 4])          → 12  (walls at 0 and 4)
//   maxContainerArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) → 49  (walls at 1 and 8)
function maxContainerArea(heights: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('basic valley',         () => maxContainerArea([3, 1, 5, 2, 4]),              12);
test('classic example',      () => maxContainerArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
test('two walls',            () => maxContainerArea([1, 1]),                        1);
test('symmetric equal',      () => maxContainerArea([4, 3, 2, 1, 4]),             16);
test('tall single middle',   () => maxContainerArea([1, 2, 4, 3, 1]),              4);
test('ascending heights',    () => maxContainerArea([1, 2, 3, 4, 5]),              6);
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
    } else { throw e; }
  }
}
