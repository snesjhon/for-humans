// =============================================================================
// Binary Trees — Level 2, Exercise 2: Find the Widest Wing Gap
// =============================================================================
// Goal: Practice child reports by comparing the sizes returned from both wings.
//
// Each room asks its left wing and right wing how many rooms they contain.
// The room's wing gap is the absolute difference between those two sizes.
// Return the largest wing gap anywhere in the museum.
//
// Example:
//   maxWingGap(room(7, room(3), room(11)))                  → 0
//   maxWingGap(room(8, room(4, room(2), room(6)), room(12))) → 2
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function maxWingGap(root: TreeNode | null): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => maxWingGap(null), 0);
test('single room', () => maxWingGap(room(7)), 0);
test('perfect small museum', () => maxWingGap(room(7, room(3), room(11))), 0);
test('lobby has gap two', () => maxWingGap(room(8, room(4, room(2), room(6)), room(12))), 2);
test('deep left hallway dominates', () => maxWingGap(room(9, room(4, room(2, room(1))), room(12))), 2);
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
