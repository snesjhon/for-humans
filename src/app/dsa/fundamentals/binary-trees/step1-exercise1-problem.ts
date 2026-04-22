// Goal: Practice returning one scout report per room to measure archive height.
//
// A scout enters each archive room and reports how many floors remain below it.
// Return the total number of floors in the archive.
//
// Example:
//   archiveHeight(room(5, room(3), room(8))) → 2
//   archiveHeight(null)                        → 0
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function archiveHeight(root: TreeNode | null): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty archive', () => archiveHeight(null), 0);
test('single room', () => archiveHeight(room(5)), 1);
test('two floors', () => archiveHeight(room(5, room(3), room(8))), 2);
test('left-heavy archive', () => archiveHeight(room(5, room(3, room(1)), null)), 3);
test('mixed archive', () => archiveHeight(room(5, room(3, room(1), room(4)), room(8, null, room(9)))), 3);
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
