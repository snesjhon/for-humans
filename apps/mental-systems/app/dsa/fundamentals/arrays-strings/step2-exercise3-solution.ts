// =============================================================================
// Arrays & Strings — Level 2, Exercise 3: Inspectors Find the Pair — SOLUTION
// =============================================================================
function twoSumSorted(nums: number[], target: number): [number, number] {
  let L = 0, R = nums.length - 1;
  while (L < R) {
    const sum = nums[L] + nums[R];
    if (sum === target) return [L + 1, R + 1];
    if (sum < target) L++;
    else R--;
  }
  throw new Error('no solution');
}

test('basic',          () => twoSumSorted([2, 7, 11, 15], 9),  [1, 2]);
test('middle pair',    () => twoSumSorted([2, 3, 4], 6),        [1, 3]);
test('negatives',      () => twoSumSorted([-1, 0], -1),         [1, 2]);
test('last two',       () => twoSumSorted([1, 2, 3, 4], 7),     [3, 4]);
test('first and last', () => twoSumSorted([1, 5, 6, 10], 11),   [1, 4]);

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
