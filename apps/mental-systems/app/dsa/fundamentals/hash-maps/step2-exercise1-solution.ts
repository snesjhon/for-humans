// =============================================================================
// Hash Maps & Sets — Level 2, Exercise 1: Count the Logbook Entries — SOLUTION
// =============================================================================
// Goal: Use a logbook (hash set) to count how many distinct values are present
//       in a single pass.
function countUnique(nums: number[]): number {
  return new Set(nums).size;
}

test('empty', () => countUnique([]), 0);
test('single', () => countUnique([42]), 1);
test('all same', () => countUnique([5, 5, 5]), 1);
test('all different', () => countUnique([1, 2, 3]), 3);
test('mixed', () => countUnique([1, 2, 2, 3, 3, 3]), 3);
test('negatives', () => countUnique([-1, -1, 0, 1, 1]), 3);

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
