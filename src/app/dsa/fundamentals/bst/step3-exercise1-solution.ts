// Goal: Produce the town's addresses in ascending order.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function collectInOrder(root: TreeNode | null): number[] {
  const result: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.value);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// ---Tests
test('empty town returns empty order', () => collectInOrder(null), []);
test('single sign returns one value', () => collectInOrder(sign(8)), [8]);
test('three-sign town returns ascending order', () => collectInOrder(sign(8, sign(3), sign(11))), [3, 8, 11]);
test('mixed town returns all values sorted', () => collectInOrder(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14)))), [1, 3, 6, 8, 9, 11, 14]);
test('right-heavy town still sorts correctly', () => collectInOrder(sign(5, null, sign(8, null, sign(13)))), [5, 8, 13]);
test('left-heavy town still sorts correctly', () => collectInOrder(sign(9, sign(6, sign(2), null), null)), [2, 6, 9]);
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
