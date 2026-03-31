// =============================================================================
// Arrays & Strings — Level 1, Exercise 2: Filter the Belt
// =============================================================================
// Goal: Use the reader + writer to reject a specific value.
//
// The belt carries mixed items. Your writer has one rule: skip anything
// equal to val. Everything else is a keeper — write it and advance.
// Return the count of items written (items not equal to val).
//
// Example:
//   removeElement([3, 2, 2, 3], 3)          → 2   (belt becomes [2, 2, ...])
//   removeElement([0, 1, 2, 2, 3, 0, 4], 2) → 5
// =============================================================================
function removeElement(nums: number[], val: number): number {
  throw new Error('not implemented');
}

test('remove middle values',   () => removeElement([3,2,2,3], 3),         2);
test('remove scattered',       () => removeElement([0,1,2,2,3,0,4,2], 2), 5);
test('remove none',            () => removeElement([1,2,3], 9),            3);
test('remove all',             () => removeElement([1,1,1], 1),             0);
test('empty array',            () => removeElement([], 5),                  0);
test('single match',           () => removeElement([4], 4),                 0);

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
