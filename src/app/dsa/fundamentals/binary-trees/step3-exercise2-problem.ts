// =============================================================================
// Binary Trees — Level 3, Exercise 2: Record the First Room on Each Floor
// =============================================================================
// Goal: Practice the floor-sweep queue by capturing the leftmost room at every level.
//
// As the docent processes one floor at a time, record the first room removed
// from the rope line for that floor.
//
// Example:
//   leftmostByFloor(room(7, room(3), room(11)))                  → [7, 3]
//   leftmostByFloor(room(8, room(4, room(2), room(6)), room(12))) → [8, 4, 2]
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function leftmostByFloor(root: TreeNode | null): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => leftmostByFloor(null), []);
test('single room', () => leftmostByFloor(room(7)), [7]);
test('two floors', () => leftmostByFloor(room(7, room(3), room(11))), [7, 3]);
test('three floors mixed', () => leftmostByFloor(room(8, room(4, room(2), room(6)), room(12, null, room(14)))), [8, 4, 2]);
test('right-leaning hallway still records first room', () => leftmostByFloor(room(5, null, room(9, null, room(12)))), [5, 9, 12]);
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
