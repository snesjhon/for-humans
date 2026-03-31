// =============================================================================
// Remove Duplicates from Sorted Array — Step 2 of 2: Scan and Catalogue New Titles — SOLUTION
// =============================================================================
// Goal: The reading hand scans every book; when it finds a title different from
//       the last one the writing hand placed, copy it forward and advance the
//       writing hand. Return the final catalog count.

function removeDuplicates(nums: number[]): number {
  // ✓ Step 1: Writing hand starts at 1 — first book is already in the curated section
  let k = 1;

  // Step 2: Reading hand sweeps every book from position 1 onward
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
      // New title — writing hand records it and steps forward
      nums[k] = nums[i];
      k++;
    }
    // Same title — reading hand moves on, writing hand stays
  }

  return k; // size of the curated section
}

// Tests — all must print PASS
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
