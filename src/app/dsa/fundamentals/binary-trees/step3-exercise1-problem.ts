// =============================================================================
// Binary Trees — Level 3, Exercise 1: Sum Each Floor
// =============================================================================
// Goal: Practice the museum rope-line sweep by computing one total per floor.
//
// The docent processes rooms floor by floor.
// Return an array where each entry is the sum of plaque values on that floor.
//
// Example:
//   levelSums(room(7, room(3), room(11)))                    → [7, 14]
//   levelSums(room(8, room(4, room(2), room(6)), room(12))) → [8, 16, 8]
// =============================================================================
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function levelSums(root: TreeNode | null): number[] {
  throw new Error('not implemented');
}

// ---Tests
test('empty museum', () => levelSums(null), []);
test('single floor', () => levelSums(room(7)), [7]);
test('two floors', () => levelSums(room(7, room(3), room(11))), [7, 14]);
test('three floors mixed', () => levelSums(room(8, room(4, room(2), room(6)), room(12, null, room(14)))), [8, 16, 22]);
test('one long hallway', () => levelSums(room(5, room(4, room(3)))), [5, 4, 3]);
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
