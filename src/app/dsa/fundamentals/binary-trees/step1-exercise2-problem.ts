// Goal: Practice returning a terminal-room count from each wing.
//
// Count how many archive rooms are true dead ends, meaning they have no smaller
// left or right wings attached to them.
//
// Example:
//   countTerminalRooms(room(5, room(3), room(8))) → 2
//   countTerminalRooms(room(5))                    → 1
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function countTerminalRooms(root: TreeNode | null): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty archive', () => countTerminalRooms(null), 0);
test('single room is terminal', () => countTerminalRooms(room(5)), 1);
test('two terminal rooms', () => countTerminalRooms(room(5, room(3), room(8))), 2);
test('one terminal deep on left', () => countTerminalRooms(room(5, room(3, room(1)), null)), 1);
test('mixed archive terminals', () => countTerminalRooms(room(5, room(3, room(1), room(4)), room(8, null, room(9)))), 3);
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
