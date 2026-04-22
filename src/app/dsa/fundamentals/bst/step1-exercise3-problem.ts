// Goal: Use the BST structure to find the smallest address.
//
// Return the smallest value stored in the town.
// If the town is empty, return null.
// The smallest address lives at the leftmost reachable sign.
//
// Example:
//   findSmallestAddress(sign(8, sign(3), sign(11))) → 3
//   findSmallestAddress(null)                        → null
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function findSmallestAddress(root: TreeNode | null): number | null {
  throw new Error('not implemented');
}

// ---Tests
test('empty town has no smallest sign', () => findSmallestAddress(null), null);
test('single sign is the smallest', () => findSmallestAddress(sign(8)), 8);
test('smallest is one left turn away', () => findSmallestAddress(sign(8, sign(3), sign(11))), 3);
test('smallest is deep on the left street', () => findSmallestAddress(sign(10, sign(6, sign(2), sign(8)), sign(14))), 2);
test('right-heavy town still returns root when no left child exists', () => findSmallestAddress(sign(5, null, sign(9, null, sign(12)))), 5);
test('mixed town ignores larger right neighborhoods', () => findSmallestAddress(sign(20, sign(7, sign(3), sign(9)), sign(30, sign(25), sign(40)))), 3);
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
