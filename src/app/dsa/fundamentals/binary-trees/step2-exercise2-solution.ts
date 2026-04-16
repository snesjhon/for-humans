// =============================================================================
// Binary Trees — Level 2, Exercise 2: Find the Widest Wing Gap — SOLUTION
// =============================================================================
// Goal: Practice child reports by comparing the sizes returned from both wings.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function maxWingGap(root: TreeNode | null): number {
  return summarize(root).bestGap;
}

function summarize(root: TreeNode | null): { size: number; bestGap: number } {
  if (root === null) return { size: 0, bestGap: 0 };

  const left = summarize(root.left);
  const right = summarize(root.right);
  const hereGap = Math.abs(left.size - right.size);

  return {
    size: left.size + right.size + 1,
    bestGap: Math.max(hereGap, left.bestGap, right.bestGap),
  };
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
