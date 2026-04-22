// Goal: Practice one-road BST navigation for an exact target.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function containsAddress(root: TreeNode | null, target: number): boolean {
  let current = root;

  while (current !== null) {
    if (target === current.value) return true;
    current = target < current.value ? current.left : current.right;
  }

  return false;
}

// ---Tests
test('empty town', () => containsAddress(null, 5), false);
test('target at root sign', () => containsAddress(sign(8, sign(3), sign(11)), 8), true);
test('target on left road', () => containsAddress(sign(8, sign(3, sign(1), sign(6)), sign(11)), 6), true);
test('target on right road', () => containsAddress(sign(8, sign(3), sign(11, sign(9), sign(14))), 14), true);
test('target missing between signs', () => containsAddress(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14))), 10), false);
test('target smaller than every sign', () => containsAddress(sign(8, sign(3), sign(11)), -2), false);
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
