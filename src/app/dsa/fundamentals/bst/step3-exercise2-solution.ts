// Goal: Gather only the addresses that fall inside an inclusive range.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function collectAddressesInRange(
  root: TreeNode | null,
  low: number,
  high: number,
): number[] {
  const result: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (node === null) return;

    if (node.value > low) dfs(node.left);
    if (node.value >= low && node.value <= high) result.push(node.value);
    if (node.value < high) dfs(node.right);
  }

  dfs(root);
  return result;
}

// ---Tests
test('empty town returns empty list', () => collectAddressesInRange(null, 4, 10), []);
test('single sign inside range is collected', () => collectAddressesInRange(sign(8), 7, 8), [8]);
test('single sign outside range is skipped', () => collectAddressesInRange(sign(8), 9, 10), []);
test('mixed town collects middle window in order', () => collectAddressesInRange(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14))), 5, 12), [6, 8, 9, 11]);
test('range can include exact endpoints', () => collectAddressesInRange(sign(10, sign(5, sign(2), sign(7)), sign(15, sign(12), sign(18))), 5, 15), [5, 7, 10, 12, 15]);
test('range above every sign returns empty list', () => collectAddressesInRange(sign(8, sign(3), sign(11)), 20, 30), []);
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
