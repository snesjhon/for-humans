// =============================================================================
// Remove Duplicates from Sorted Array — Complete Solution
// =============================================================================

function removeDuplicates(nums: number[]): number {
  // Writing hand starts at 1 — the first book is always the first unique title
  let k = 1;

  // Reading hand sweeps every book; writing hand only advances on new titles
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
      // New title found — copy it to the next open slot in the curated section
      nums[k] = nums[i];
      k++; // writing hand steps forward
    }
  }

  return k; // number of unique titles catalogued
}

// Tests — all must print PASS
test('single element', () => removeDuplicates([1]), 1);
test('[1, 1, 2] → 2', () => removeDuplicates([1, 1, 2]), 2);
test('[1, 1, 1] → 1', () => removeDuplicates([1, 1, 1]), 1);
test('[1, 2, 3] → 3', () => removeDuplicates([1, 2, 3]), 3);
test('[0,0,1,1,1,2,2,3,3,4] → 5', () => removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]), 5);
test('array mutated correctly [1,1,2]', () => {
  const a = [1, 1, 2];
  const k = removeDuplicates(a);
  return a.slice(0, k);
}, [1, 2]);
test('array mutated correctly [0,0,1,1,1,2,2,3,3,4]', () => {
  const a = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
  const k = removeDuplicates(a);
  return a.slice(0, k);
}, [0, 1, 2, 3, 4]);

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
