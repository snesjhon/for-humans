// =============================================================================
// Binary Trees — Level 1, Exercise 3: Collect the End-Gallery Plaques
// =============================================================================
// Goal: Practice hallway descent by recording the plaques in every leaf room.
//
// A leaf room is an end gallery with no left or right doorway.
// Return the leaf plaques from left to right.
//
// Example:
//   leafPlaques(room(7, room(3), room(11)))                 → [3, 11]
//   leafPlaques(room(8, room(4, room(2), room(6)), null))  → [2, 6]
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function leafPlaques(root: TreeNode | null): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => leafPlaques(null), []);
test('single room is a leaf', () => leafPlaques(room(7)), [7]);
test('two leaf galleries', () => leafPlaques(room(7, room(3), room(11))), [3, 11]);
test('left-to-right order', () => leafPlaques(room(8, room(4, room(2), room(6)), room(12, null, room(14)))), [2, 6, 14]);
test('one long hallway', () => leafPlaques(room(5, room(4, room(3)))), [3]);
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
