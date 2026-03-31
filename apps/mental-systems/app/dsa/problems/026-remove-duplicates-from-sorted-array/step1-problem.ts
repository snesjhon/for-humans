// =============================================================================
// Remove Duplicates from Sorted Array — Step 1 of 2: Initialize the Writing Hand
// =============================================================================
// Goal: Set up the writing hand at position 1, since the first book is always
//       the first unique title in the curated section.

function removeDuplicates(nums: number[]): number {
  throw new Error('not implemented');
}

// Tests — step 1: only the single-element case passes (no loop yet)
test('single element stays', () => removeDuplicates([1]), 1);
test('writing hand starts at 1', () => removeDuplicates([5]), 1);

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
