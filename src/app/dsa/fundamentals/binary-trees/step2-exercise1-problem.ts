// Goal: Practice sweeping the archive one floor at a time with a cart line.
//
// Return the room labels grouped by floor from top to bottom.
//
// Example:
//   floorPlans(room(1, room(2), room(3))) → [[1], [2, 3]]
//   floorPlans(null)                       → []
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function floorPlans(root: TreeNode | null): number[][] {
  throw new Error('not implemented');
}

// ---Tests
test('empty archive', () => floorPlans(null), []);
test('single floor', () => floorPlans(room(1)), [[1]]);
test('two floors', () => floorPlans(room(1, room(2), room(3))), [[1], [2, 3]]);
test('mixed archive', () => floorPlans(room(1, room(2, room(4), room(5)), room(3, null, room(6)))), [[1], [2, 3], [4, 5, 6]]);
test('lopsided archive', () => floorPlans(room(1, room(2, room(3), null), null)), [[1], [2], [3]]);
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
