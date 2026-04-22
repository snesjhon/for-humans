// Goal: Practice clipping bad wings while the notebook tracks the richest route.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function richestRoute(root: TreeNode | null): number {
  let best = -Infinity;

  function gain(node: TreeNode | null): number {
    if (node === null) return 0;

    const leftGain = Math.max(0, gain(node.left));
    const rightGain = Math.max(0, gain(node.right));
    best = Math.max(best, node.value + leftGain + rightGain);

    return node.value + Math.max(leftGain, rightGain);
  }

  gain(root);
  return best;
}

// ---Tests
test('single room', () => richestRoute(room(5)), 5);
test('all positive bend', () => richestRoute(room(1, room(2), room(3))), 6);
test('negative wings clipped', () => richestRoute(room(2, room(-1), room(4))), 6);
test('best route below entrance', () => richestRoute(room(-10, room(9), room(20, room(15), room(7)))), 42);
test('all negative archive', () => richestRoute(room(-3, room(-2), room(-5))), -2);
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
