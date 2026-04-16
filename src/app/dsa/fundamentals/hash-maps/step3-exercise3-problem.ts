// Goal: Use a running tally + modulo checkpoint map to count how many
//       contiguous subarrays have a sum divisible by k.
//
// Key insight: two prefix sums that share the same remainder mod k bracket a
// subarray whose sum is divisible by k. Store remainder → count of times seen.
// Seed with {0: 1} for subarrays starting at index 0.
// Use ((sum % k) + k) % k to handle negative remainders correctly.
//
// Example:
//   countDivisibleSubarrays([4,5,0,-2,-3,1], 5)  → 7
//   countDivisibleSubarrays([1,2,3], 3)           → 3   ([3],[1,2],[1,2,3])
//   countDivisibleSubarrays([5], 5)               → 1
function countDivisibleSubarrays(nums: number[], k: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty', () => countDivisibleSubarrays([], 3), 0);
test('single hit', () => countDivisibleSubarrays([5], 5), 1);
test('single miss', () => countDivisibleSubarrays([4], 5), 0);
test('three subarrays', () => countDivisibleSubarrays([1, 2, 3], 3), 3);
test(
  'classic example',
  () => countDivisibleSubarrays([4, 5, 0, -2, -3, 1], 5),
  7,
);
test('all zeros', () => countDivisibleSubarrays([0, 0, 0], 1), 6);
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
