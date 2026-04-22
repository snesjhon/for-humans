// Goal: Practice passing a yes-or-no scout report back through the archive.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function hasCatalogCode(root: TreeNode | null, target: number): boolean {
  if (root === null) return false;
  if (root.value === target) return true;
  return hasCatalogCode(root.left, target) || hasCatalogCode(root.right, target);
}

// ---Tests
test('empty archive', () => hasCatalogCode(null, 7), false);
test('target at entrance', () => hasCatalogCode(room(5, room(3), room(8)), 5), true);
test('target in left wing', () => hasCatalogCode(room(5, room(3, room(1), room(4)), room(8)), 4), true);
test('target in right wing', () => hasCatalogCode(room(5, room(3), room(8, null, room(9))), 9), true);
test('target missing', () => hasCatalogCode(room(5, room(3, room(1), room(4)), room(8, null, room(9))), 6), false);
// ---End Tests

// ---Helpers
function room(
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
