// =============================================================================
// Remove Element — Step 2 of 2: The Packer's Hand
// =============================================================================
// Goal: When the scanner approves a product, have the packer actually place it
//       into slot k before advancing. nums[0..k-1] must hold the kept items.

function removeElement(nums: number[], val: number): number {
  let k = 0; // ✓ Step 1: packer's slot counter (locked)
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      // ✓ Step 1: gate passes — product is good (locked)
      throw new Error('not implemented');
      // Step 2: write the product to slot k, then advance k
    }
  }
  return k;
}

// Tests — step 1 count tests + new array-content checks
test('empty belt', () => removeElement([], 3), 0);
test('all defective — count', () => removeElement([3, 3, 3], 3), 0);
test('none defective — count', () => removeElement([1, 2, 4], 3), 3);
test('mixed — count only', () => removeElement([3, 2, 2, 3], 3), 2);
test('mixed — packed correctly', () => {
  const nums = [3, 2, 2, 3];
  const k = removeElement(nums, 3);
  return [k, nums.slice(0, k)];
}, [2, [2, 2]]);
test('example 2 — packed correctly', () => {
  const nums = [0, 1, 2, 2, 3, 0, 4, 2];
  const k = removeElement(nums, 2);
  return [k, nums.slice(0, k)];
}, [5, [0, 1, 3, 0, 4]]);

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
