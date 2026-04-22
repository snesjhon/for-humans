// Goal: Count how many signs the clerk inspects during direct BST descent.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function countVisitedSigns(root: TreeNode | null, target: number): number {
  let current = root;
  let visited = 0;

  while (current !== null) {
    visited += 1;
    if (target === current.value) return visited;
    current = target < current.value ? current.left : current.right;
  }

  return visited;
}

// ---Tests
test('empty town visits zero signs', () => countVisitedSigns(null, 4), 0);
test('match at root counts one sign', () => countVisitedSigns(sign(8, sign(3), sign(11)), 8), 1);
test('right-road match counts two signs', () => countVisitedSigns(sign(8, sign(3), sign(11, sign(9), sign(14))), 14), 3);
test('missing address falls out after two signs', () => countVisitedSigns(sign(8, sign(3), sign(11)), 7), 2);
test('left-heavy miss counts every visited sign', () => countVisitedSigns(sign(9, sign(5, sign(2), sign(7)), sign(12)), 1), 3);
test('middle miss on right branch', () => countVisitedSigns(sign(10, sign(4), sign(15, sign(12), sign(18))), 13), 3);
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
