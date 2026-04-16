// Goal: Practice the pin-one-pointer reduction from 3Sum to pair-sum.
//
// A "zero-balance triplet" is three numbers from the array that sum to zero.
// Return all unique triplets — no duplicates in the result, even if the array
// contains repeated values.
//
// Algorithm:
//   1. Sort the array.
//   2. For each index i, run a two-pointer on [i+1, n-1] targeting -nums[i].
//   3. Skip duplicate values at the outer loop (i) and after recording each triplet.
//
// Example:
//   threeSumZero([-4,-1,-1,0,1,2]) → [[-1,-1,2],[-1,0,1]]
//   threeSumZero([0,0,0])           → [[0,0,0]]
function threeSumZero(nums: number[]): number[][] {
  throw new Error('not implemented');
}

// ---Tests
test('standard case',    () => threeSumZero([-4, -1, -1, 0, 1, 2]),  [[-1,-1,2],[-1,0,1]]);
test('all zeros',        () => threeSumZero([0, 0, 0]),               [[0,0,0]]);
test('no triplets',      () => threeSumZero([1, 2, 3]),               []);
test('empty array',      () => threeSumZero([]),                      []);
test('with duplicates',  () => threeSumZero([-2, 0, 0, 2, 2]),       [[-2,0,2]]);
test('two elements',     () => threeSumZero([0, 0]),                  []);
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
