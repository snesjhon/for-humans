// Goal: Walk every product on the belt and count how many pass the gate
//       (are NOT equal to the defect code val). Return k.

function removeElement(nums: number[], val: number): number {
  let k = 0; // packer's slot — starts empty, not placed anything yet
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) { // gate: is this product good?
      k++; // approved — advance packer's counter
    }
    // defective products: scanner moves on, packer stays put
  }
  return k; // how many products shipped
}

// ---Tests
test('empty belt', () => removeElement([], 3), 0);
test('all defective', () => removeElement([3, 3, 3], 3), 0);
test('none defective', () => removeElement([1, 2, 4], 3), 3);
test('mixed — count only', () => removeElement([3, 2, 2, 3], 3), 2);
test('single good product', () => removeElement([1], 3), 1);
test('single defective product', () => removeElement([3], 3), 0);
// ---End Tests

// ---Helpers

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
