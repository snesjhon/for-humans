// =============================================================================
// Two Pointers — Level 3, Exercise 1: Find All Zero-Balance Triplets — SOLUTION
// =============================================================================
// Goal: Practice the pin-one-pointer reduction from 3Sum to pair-sum.
//
// Sort once. For each i, run two-pointer on [i+1, n-1] targeting -nums[i].
// Skip outer duplicates at the start of each iteration.
// After recording a triplet, skip inner duplicates before advancing L and R.
// =============================================================================
function threeSumZero(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip outer duplicate
    let L = i + 1, R = nums.length - 1;
    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];
      if (sum === 0) {
        result.push([nums[i], nums[L], nums[R]]);
        while (L < R && nums[L] === nums[L + 1]) L++; // skip inner dups
        while (L < R && nums[R] === nums[R - 1]) R--;
        L++; R--;
      } else if (sum < 0) {
        L++;
      } else {
        R--;
      }
    }
  }
  return result;
}

test('standard case',    () => threeSumZero([-4, -1, -1, 0, 1, 2]),  [[-1,-1,2],[-1,0,1]]);
test('all zeros',        () => threeSumZero([0, 0, 0]),               [[0,0,0]]);
test('no triplets',      () => threeSumZero([1, 2, 3]),               []);
test('empty array',      () => threeSumZero([]),                      []);
test('with duplicates',  () => threeSumZero([-2, 0, 0, 2, 2]),       [[-2,0,2]]);
test('two elements',     () => threeSumZero([0, 0]),                  []);

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
