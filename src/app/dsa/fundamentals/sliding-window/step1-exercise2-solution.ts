// Goal: Practice the fixed-size slide returning a minimum, not a maximum.
//
// Build the first window sum manually.
// Slide: add nums[R], remove nums[R-k], divide by k for average.
// Track the minimum average seen.
function minWindowAverage(nums: number[], k: number): number {
  if (k > nums.length) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let minAvg = windowSum / k;

  for (let R = k; R < nums.length; R++) {
    windowSum += nums[R] - nums[R - k];
    minAvg = Math.min(minAvg, windowSum / k);
  }

  return minAvg;
}

// ---Tests
test('min at end',             () => minWindowAverage([3, 7, 5, 2, 4, 1], 3),   7/3);
test('min at start',           () => minWindowAverage([1, 4, 2, 5], 2),         2.5);
test('min in middle',          () => minWindowAverage([5, 1, 2, 3], 2),         1.5);
test('all same elements',      () => minWindowAverage([4, 4, 4, 4], 2),         4.0);
test('k equals array length',  () => minWindowAverage([2, 3, 1], 3),            2.0);
test('k larger than array',    () => minWindowAverage([1, 2], 5),               0);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass =
      typeof actual === 'number' && typeof expected === 'number'
        ? Math.abs(actual - expected) < 1e-9
        : JSON.stringify(actual) === JSON.stringify(expected);
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
