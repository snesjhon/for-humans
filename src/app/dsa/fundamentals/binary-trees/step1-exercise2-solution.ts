// =============================================================================
// Binary Trees — Level 1, Exercise 2: Find the Target Plaque — SOLUTION
// =============================================================================
// Goal: Practice hallway descent by searching for one plaque anywhere in the museum.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function hasPlaque(root: TreeNode | null, target: number): boolean {
  if (root === null) return false;
  if (root.value === target) return true;
  return hasPlaque(root.left, target) || hasPlaque(root.right, target);
}

// ---Tests
test('empty museum', () => hasPlaque(null, 4), false);
test('finds lobby plaque', () => hasPlaque(room(7), 7), true);
test('finds left wing plaque', () => hasPlaque(room(7, room(3), room(11)), 3), true);
test('finds deep right plaque', () => hasPlaque(room(8, room(4), room(12, room(10), room(14))), 14), true);
test('missing plaque', () => hasPlaque(room(8, room(4), room(12, room(10), room(14))), 5), false);
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
