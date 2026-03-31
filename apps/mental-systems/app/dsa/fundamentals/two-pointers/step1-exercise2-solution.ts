// =============================================================================
// Two Pointers — Level 1, Exercise 2: Closest Meeting Point — SOLUTION
// =============================================================================
// Goal: Extend the two-pointer decision loop to track a running best.
//
// At each step: record the sum if it is closer to target than the current best.
// Move L right if sum < target (need larger), R left if sum > target (need smaller).
// Return immediately on an exact match — cannot do better.
// =============================================================================
function closestPairSum(nums: number[], target: number): number {
  let L = 0, R = nums.length - 1;
  let closest = nums[0] + nums[1];
  while (L < R) {
    const sum = nums[L] + nums[R];
    if (Math.abs(sum - target) < Math.abs(closest - target)) {
      closest = sum;
    }
    if (sum === target) return target;
    else if (sum < target) L++;
    else R--;
  }
  return closest;
}

test('closest is below target',  () => closestPairSum([1, 3, 8, 10, 15], 12), 11);
test('exact match exists',       () => closestPairSum([1, 2, 3, 4, 5],    6),  6);
test('closest is above target',  () => closestPairSum([2, 4, 6, 8],     5),  6);
test('two elements',             () => closestPairSum([3, 7],             8),  10);
test('negative numbers',         () => closestPairSum([-10, -3, 0, 5, 9], 0), -1);
test('all same value',           () => closestPairSum([5, 5, 5],          9),  10);

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
