// =============================================================================
// Binary Trees — Level 2, Exercise 1: Count the Fork Rooms
// =============================================================================
// Goal: Practice child reports by counting rooms that open into two wings.
//
// A fork room has both a left doorway and a right doorway.
// Each child wing returns its own fork-room count, and the current room decides
// whether to add 1 for itself before reporting upward.
//
// Example:
//   countForkRooms(room(7, room(3), room(11)))                → 1
//   countForkRooms(room(8, room(4, room(2), room(6)), null)) → 1
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function countForkRooms(root: TreeNode | null): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => countForkRooms(null), 0);
test('single room', () => countForkRooms(room(7)), 0);
test('one fork at lobby', () => countForkRooms(room(7, room(3), room(11))), 1);
test(
  'two fork rooms',
  () => countForkRooms(room(8, room(4, room(2), room(6)), room(12, null, room(14)))),
  2,
);
test('long hallway has no forks', () => countForkRooms(room(5, room(4, room(3)))), 0);
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
