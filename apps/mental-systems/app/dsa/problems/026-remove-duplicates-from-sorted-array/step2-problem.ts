// =============================================================================
// Remove Duplicates from Sorted Array — Step 2 of 2: Scan and Catalogue New Titles
// =============================================================================
// Goal: The reading hand scans every book; when it finds a title different from
//       the last one the writing hand placed, copy it forward and advance the
//       writing hand. Return the final catalog count.
//
// Prior steps are complete and locked inside the function body.

function removeDuplicates(nums: number[]): number {
  // ✓ Step 1: Writing hand starts at 1 (locked)
  let k = 1;

  throw new Error('not implemented');
}

// Tests
test('single element', () => removeDuplicates([1]), 1);
test('[1, 1, 2] → 2', () => removeDuplicates([1, 1, 2]), 2);
test('[1, 1, 1] → 1', () => removeDuplicates([1, 1, 1]), 1);
test('[1, 2, 3] → 3', () => removeDuplicates([1, 2, 3]), 3);
test('[0,0,1,1,1,2,2,3,3,4] → 5', () => removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]), 5);

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
