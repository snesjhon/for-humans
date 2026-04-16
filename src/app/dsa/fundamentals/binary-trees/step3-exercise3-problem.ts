// =============================================================================
// Binary Trees — Level 3, Exercise 3: Find the First Floor With the Target Plaque
// =============================================================================
// Goal: Practice a queue-driven floor sweep by stopping at the earliest floor that contains a target plaque.
//
// Return the floor number of the first room whose plaque equals target.
// The lobby is floor 0. If the plaque never appears, return -1.
//
// Example:
//   firstFloorWithPlaque(room(7, room(3), room(11)), 11) → 1
//   firstFloorWithPlaque(room(7, room(3), room(11)), 9)  → -1
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function firstFloorWithPlaque(root: TreeNode | null, target: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => firstFloorWithPlaque(null, 7), -1);
test('target in lobby', () => firstFloorWithPlaque(room(7, room(3), room(11)), 7), 0);
test('target on second floor', () => firstFloorWithPlaque(room(7, room(3), room(11)), 11), 1);
test('target on third floor', () => firstFloorWithPlaque(room(8, room(4, room(2), room(6)), room(12, null, room(14))), 14), 2);
test('missing plaque', () => firstFloorWithPlaque(room(8, room(4, room(2), room(6)), room(12, null, room(14))), 5), -1);
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
