// =============================================================================
// Binary Trees — Level 1, Exercise 1: Count the Open Rooms — SOLUTION
// =============================================================================
// Goal: Practice the museum-hallway base case by counting every reachable room.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function countRooms(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + countRooms(root.left) + countRooms(root.right);
}

// ---Tests
test('empty museum', () => countRooms(null), 0);
test('single lobby', () => countRooms(room(7)), 1);
test('three-room museum', () => countRooms(room(7, room(3), room(11))), 3);
test('left-heavy hallway', () => countRooms(room(5, room(4, room(3)))), 3);
test(
  'mixed museum',
  () => countRooms(room(8, room(4, room(2), room(6)), room(12, null, room(14)))),
  6,
);
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
