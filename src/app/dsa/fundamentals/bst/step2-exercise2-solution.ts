// Goal: Track the largest address that does not rise above the target.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function findFloorAddress(root: TreeNode | null, target: number): number | null {
  let current = root;
  let candidate: number | null = null;

  while (current !== null) {
    if (current.value === target) return current.value;

    if (current.value < target) {
      candidate = current.value;
      current = current.right;
    } else {
      current = current.left;
    }
  }

  return candidate;
}

// ---Tests
test('empty town has no floor', () => findFloorAddress(null, 10), null);
test('exact match is its own floor', () => findFloorAddress(sign(8, sign(3), sign(11)), 3), 3);
test('floor is the next smaller sign', () => findFloorAddress(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14))), 10), 9);
test('floor can be the root sign', () => findFloorAddress(sign(8, sign(3), sign(11)), 8), 8);
test('target below every sign returns null', () => findFloorAddress(sign(8, sign(3), sign(11)), -1), null);
test('floor chooses the tighter lead on the right', () => findFloorAddress(sign(15, sign(10, sign(8), sign(12)), sign(18)), 11), 10);
// ---End Tests

// ---Helpers
function sign(
  value: number,
  left: TreeNode | null = null,
  right: TreeNode | null = null,
): TreeNode {
  return { value, left, right };
}

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
// ---End Helpers
