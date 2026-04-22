// Goal: Track the smallest address that is not below the target.
//
// Return the ceiling of target in the BST.
// The ceiling is the smallest value >= target.
// If no such sign exists, return null.
//
// Example:
//   findCeilingAddress(sign(8, sign(3), sign(11)), 10) → 11
//   findCeilingAddress(sign(8, sign(3), sign(11)), 12) → null
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function findCeilingAddress(
  root: TreeNode | null,
  target: number,
): number | null {
  throw new Error('not implemented');
}

// ---Tests
test('empty town has no ceiling', () => findCeilingAddress(null, 10), null);
test('exact match is its own ceiling', () => findCeilingAddress(sign(8, sign(3), sign(11)), 11), 11);
test('ceiling is the next larger sign', () => findCeilingAddress(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14))), 10), 11);
test('ceiling can be the root sign', () => findCeilingAddress(sign(8, sign(3), sign(11)), 7), 8);
test('target above every sign returns null', () => findCeilingAddress(sign(8, sign(3), sign(11, sign(9), sign(14))), 20), null);
test('ceiling chooses the tighter lead on the left', () => findCeilingAddress(sign(15, sign(10, sign(8), sign(12)), sign(18)), 11), 12);
// ---End Tests

// ---Helpers
function sign(
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
