// =============================================================================
// Binary Trees — Level 1, Exercise 1: Count the Open Rooms
// =============================================================================
// Goal: Practice the museum-hallway base case by counting every reachable room.
//
// A docent starts in the lobby room and walks down both doorways.
// Each real room counts as 1. Each missing doorway counts as 0.
// Return the total number of rooms in the whole museum.
//
// Example:
//   countRooms(room(7, room(3), room(11)))     → 3
//   countRooms(null)                           → 0
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function countRooms(root: TreeNode | null): number {
  throw new Error('not implemented');
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
