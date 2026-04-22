// Goal: Practice using the last cart-line room on each floor.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function lastRoomOnEachFloor(root: TreeNode | null): number[] {
  if (root === null) return [];

  const result: number[] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const floorSize = queue.length;
    let lastValue = queue[0].value;

    for (let i = 0; i < floorSize; i++) {
      const node = queue.shift()!;
      lastValue = node.value;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(lastValue);
  }

  return result;
}

// ---Tests
test('empty archive', () => lastRoomOnEachFloor(null), []);
test('single room', () => lastRoomOnEachFloor(room(1)), [1]);
test('balanced archive', () => lastRoomOnEachFloor(room(1, room(2), room(3))), [1, 3]);
test('mixed archive', () => lastRoomOnEachFloor(room(1, room(2, room(4), room(5)), room(3, null, room(6)))), [1, 3, 6]);
test('left-only archive', () => lastRoomOnEachFloor(room(1, room(2, room(3), null), null)), [1, 2, 3]);
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
