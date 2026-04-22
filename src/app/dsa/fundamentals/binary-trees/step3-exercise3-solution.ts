// Goal: Practice returning two alternating hallway reports while the notebook tracks the longest turn pattern.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function longestAlternatingHallway(root: TreeNode | null): number {
  let best = 0;

  function dfs(node: TreeNode | null): [number, number] {
    if (node === null) return [-1, -1];

    const [leftStartsLeft, leftStartsRight] = dfs(node.left);
    const [rightStartsLeft, rightStartsRight] = dfs(node.right);

    const goLeft = leftStartsRight + 1;
    const goRight = rightStartsLeft + 1;
    best = Math.max(best, goLeft, goRight);

    return [goLeft, goRight];
  }

  dfs(root);
  return best;
}

// ---Tests
test('empty archive', () => longestAlternatingHallway(null), 0);
test('single room', () => longestAlternatingHallway(room(1)), 0);
test('one clean left-right turn', () => longestAlternatingHallway(room(1, room(2, null, room(4)), room(3))), 2);
test('long alternating chain', () => longestAlternatingHallway(room(1, room(2, null, room(4, room(6), null)), room(3))), 3);
test('best route starts below entrance', () => longestAlternatingHallway(room(1, room(2, room(5), null), room(3, room(4, null, room(6)), null))), 3);
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
