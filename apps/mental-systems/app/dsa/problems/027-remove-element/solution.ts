// =============================================================================
// Remove Element — Complete Solution
// =============================================================================

function removeElement(nums: number[], val: number): number {
  let k = 0; // packer's slot — starts empty
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {     // gate: is this product good (not defective)?
      nums[k] = nums[i];       // packer places it into the next open slot
      k++;                     // packer advances to the next slot
    }
    // defective products: scanner moves on, packer stays put
  }
  return k; // how many products shipped
}

// Tests — all must print PASS
test('empty belt', () => removeElement([], 3), 0);
test('all defective', () => removeElement([3, 3, 3], 3), 0);
test('none defective — count', () => removeElement([1, 2, 4], 3), 3);
test('none defective — packed', () => {
  const nums = [1, 2, 4];
  const k = removeElement(nums, 3);
  return [k, nums.slice(0, k)];
}, [3, [1, 2, 4]]);
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
test('single element matching val', () => {
  const nums = [5];
  const k = removeElement(nums, 5);
  return [k, nums.slice(0, k)];
}, [0, []]);
test('single element not matching', () => {
  const nums = [5];
  const k = removeElement(nums, 3);
  return [k, nums.slice(0, k)];
}, [1, [5]]);

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
