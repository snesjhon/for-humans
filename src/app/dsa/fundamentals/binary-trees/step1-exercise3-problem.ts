// Goal: Practice passing a yes-or-no scout report back through the archive.
//
// Return true if any room in the archive carries the target catalog code.
// Each room checks itself, then asks whether either smaller wing already found it.
//
// Example:
//   hasCatalogCode(room(5, room(3), room(8)), 8) → true
//   hasCatalogCode(room(5, room(3), room(8)), 7) → false
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function hasCatalogCode(root: TreeNode | null, target: number): boolean {
  throw new Error('not implemented');
}

// ---Tests
test('empty archive', () => hasCatalogCode(null, 7), false);
test('target at entrance', () => hasCatalogCode(room(5, room(3), room(8)), 5), true);
test('target in left wing', () => hasCatalogCode(room(5, room(3, room(1), room(4)), room(8)), 4), true);
test('target in right wing', () => hasCatalogCode(room(5, room(3), room(8, null, room(9))), 9), true);
test('target missing', () => hasCatalogCode(room(5, room(3, room(1), room(4)), room(8, null, room(9))), 6), false);
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
