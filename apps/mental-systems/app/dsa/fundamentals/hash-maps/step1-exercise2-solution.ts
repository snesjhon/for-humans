// =============================================================================
// Hash Maps & Sets — Level 1, Exercise 2: Find the Most-Filed Card — SOLUTION
// =============================================================================
// Goal: Use the frequency catalog to retrieve the element with the highest count.
function mostFrequent(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  let best = nums[0];
  let bestCount = 0;
  for (const [val, count] of freq) {
    if (count > bestCount || (count === bestCount && val < best)) {
      best = val;
      bestCount = count;
    }
  }
  return best;
}

test('single element', () => mostFrequent([7]), 7);
test('clear winner', () => mostFrequent([1, 2, 2, 3]), 2);
test('three-way tie picks smallest', () => mostFrequent([3, 1, 2]), 1);
test('dominant front', () => mostFrequent([5, 5, 5, 1, 1]), 5);
test('dominant back', () => mostFrequent([1, 2, 3, 3, 3]), 3);
test('two-way tie picks smaller', () => mostFrequent([4, 4, 9, 9]), 4);

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
