// Goal: Practice keeping only the deepest floor's running total.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function deepestFloorSum(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue: TreeNode[] = [root];
  let lastFloorSum = 0;

  while (queue.length > 0) {
    const floorSize = queue.length;
    let floorSum = 0;

    for (let i = 0; i < floorSize; i++) {
      const node = queue.shift()!;
      floorSum += node.value;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    lastFloorSum = floorSum;
  }

  return lastFloorSum;
}

// ---Tests
test('empty archive', () => deepestFloorSum(null), 0);
test('single room', () => deepestFloorSum(room(7)), 7);
test('two floors', () => deepestFloorSum(room(1, room(2), room(3))), 5);
test('mixed archive', () => deepestFloorSum(room(1, room(2, room(4), room(5)), room(3, null, room(6)))), 15);
test('deep left chain', () => deepestFloorSum(room(1, room(2, room(3, room(4)), null), null)), 4);
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
