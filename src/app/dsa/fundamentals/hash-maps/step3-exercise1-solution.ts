// Goal: Use a running tally + logbook to detect whether any contiguous subarray
//       sums to exactly zero — in a single pass.
function hasZeroSumSubarray(nums: number[]): boolean {
  const seen = new Set<number>();
  seen.add(0); // seed: empty prefix has tally 0
  let sum = 0;
  for (const n of nums) {
    sum += n;
    if (seen.has(sum)) return true; // tally repeated → subarray between checkpoints = 0
    seen.add(sum);
  }
  return false;
}

// ---Tests
test('false: positive only', () => hasZeroSumSubarray([1, 2, 3]), false);
test('true: zero element', () => hasZeroSumSubarray([0]), true);
test('true: pair cancels', () => hasZeroSumSubarray([1, -1, 2]), true);
test(
  'true: triple sums to zero',
  () => hasZeroSumSubarray([3, 1, -4, 2]),
  true,
);
test('true: whole array', () => hasZeroSumSubarray([1, 2, -3]), true);
test('false: partial negatives', () => hasZeroSumSubarray([4, -1, 3]), false);
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
