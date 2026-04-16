// =============================================================================
// Binary Trees — Level 2, Exercise 3: Count the Balanced Display Rooms
// =============================================================================
// Goal: Practice richer child reports by checking whether a room's two wings are evenly sized.
//
// A display room is balanced when its left wing and right wing contain the same
// number of rooms. Return how many rooms in the museum are balanced.
//
// Example:
//   countBalancedRooms(room(7, room(3), room(11)))                 → 3
//   countBalancedRooms(room(8, room(4, room(2), null), room(12))) → 2
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function countBalancedRooms(root: TreeNode | null): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => countBalancedRooms(null), 0);
test('single room is balanced', () => countBalancedRooms(room(7)), 1);
test('all rooms balanced in perfect trio', () => countBalancedRooms(room(7, room(3), room(11))), 3);
test('uneven left wing', () => countBalancedRooms(room(8, room(4, room(2), null), room(12))), 2);
test('larger mixed museum', () => countBalancedRooms(room(10, room(5, room(2), room(7)), room(14, null, room(18)))), 4);
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
