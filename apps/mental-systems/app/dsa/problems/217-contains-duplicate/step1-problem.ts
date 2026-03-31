// =============================================================================
// Contains Duplicate — Step 1 of 2: Open the Album
// =============================================================================
// Goal: Initialize the stamp album (Set) and return false by default —
//       no duplicates have been found before any scanning begins.

function containsDuplicate(nums: number[]): boolean {
  throw new Error('not implemented');
}

// Tests — step 1: only the trivially-true cases pass (no loop yet)
test('empty pile has no duplicates', () => containsDuplicate([]), false);
test('single stamp has no duplicates', () => containsDuplicate([42]), false);

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
