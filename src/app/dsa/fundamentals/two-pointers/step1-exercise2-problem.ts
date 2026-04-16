// Goal: Extend the two-pointer decision loop to track a running best.
//
// Two inspectors walk a sorted lane looking for the pair whose combined
// reading lands closest to a target value. There may be no exact match —
// they need to remember the best they have seen so far as they converge.
//
// Return the pair sum closest in absolute value to target.
// If two sums are equidistant, return either one.
// Assume the input has at least two elements.
//
// Example:
//   closestPairSum([1, 3, 8, 10, 15], 12) → 11  (3 + 8 = 11, distance 1)
//   closestPairSum([1, 2, 3, 4, 5],   6)  → 6   (exact match: 1+5, 2+4)
function closestPairSum(nums: number[], target: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('closest is below target',  () => closestPairSum([1, 3, 8, 10, 15], 12), 11);
test('exact match exists',       () => closestPairSum([1, 2, 3, 4, 5],    6),  6);
test('closest is above target',  () => closestPairSum([2, 4, 6, 8],     5),  6);
test('two elements',             () => closestPairSum([3, 7],             8),  10);
test('negative numbers',         () => closestPairSum([-10, -3, 0, 5, 9], 0), -1);
test('all same value',           () => closestPairSum([5, 5, 5],          9),  10);
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
