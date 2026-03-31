// =============================================================================
// Hash Maps & Sets — Level 3, Exercise 3: Count Tallies That Hit Round Numbers — SOLUTION
// =============================================================================
// Goal: Use a running tally + modulo checkpoint map to count how many
//       contiguous subarrays have a sum divisible by k.
function countDivisibleSubarrays(nums: number[], k: number): number {
  const modCounts = new Map<number, number>();
  modCounts.set(0, 1); // seed: empty prefix has remainder 0

  let sum = 0;
  let count = 0;

  for (const n of nums) {
    sum += n;
    // ((sum % k) + k) % k normalizes negative remainders to [0, k-1]
    const mod = ((sum % k) + k) % k;
    count += modCounts.get(mod) ?? 0;
    modCounts.set(mod, (modCounts.get(mod) ?? 0) + 1);
  }

  return count;
}

test('empty', () => countDivisibleSubarrays([], 3), 0);
test('single hit', () => countDivisibleSubarrays([5], 5), 1);
test('single miss', () => countDivisibleSubarrays([4], 5), 0);
test('three subarrays', () => countDivisibleSubarrays([1, 2, 3], 3), 3);
test('classic example', () => countDivisibleSubarrays([4, 5, 0, -2, -3, 1], 5), 7);
test('all zeros', () => countDivisibleSubarrays([0, 0, 0], 1), 6);

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
    } else {
      throw e;
    }
  }
}
