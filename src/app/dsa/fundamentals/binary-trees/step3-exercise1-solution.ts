// Goal: Practice returning one hallway depth while the notebook tracks the best route.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function longestHallway(root: TreeNode | null): number {
  let best = 0;

  function depth(node: TreeNode | null): number {
    if (node === null) return 0;

    const leftDepth = depth(node.left);
    const rightDepth = depth(node.right);
    best = Math.max(best, leftDepth + rightDepth);

    return 1 + Math.max(leftDepth, rightDepth);
  }

  depth(root);
  return best;
}

// ---Tests
test('empty archive', () => longestHallway(null), 0);
test('single room', () => longestHallway(room(1)), 0);
test('simple bend through entrance', () => longestHallway(room(1, room(2), room(3))), 2);
test('deep left route', () => longestHallway(room(1, room(2, room(4, room(7)), room(5)), room(3))), 4);
test('route bends below entrance', () => longestHallway(room(1, room(2, room(4), room(5)), room(3, null, room(6, null, room(7))))), 5);
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
