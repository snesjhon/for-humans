// Goal: Track the sign whose address is closest to the target.
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function findClosestAddress(
  root: TreeNode | null,
  target: number,
): number | null {
  if (root === null) return null;

  let current: TreeNode | null = root;
  let candidate = root.value;

  while (current !== null) {
    const currentDistance = Math.abs(current.value - target);
    const candidateDistance = Math.abs(candidate - target);

    if (
      currentDistance < candidateDistance ||
      (currentDistance === candidateDistance && current.value < candidate)
    ) {
      candidate = current.value;
    }

    if (current.value === target) return current.value;
    current = target < current.value ? current.left : current.right;
  }

  return candidate;
}

// ---Tests
test('empty town has no closest sign', () => findClosestAddress(null, 10), null);
test('exact match wins immediately', () => findClosestAddress(sign(8, sign(3), sign(11)), 11), 11);
test('larger sign is closer', () => findClosestAddress(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14))), 10), 9);
test('smaller sign wins tie by rule', () => findClosestAddress(sign(8, sign(3), sign(11)), 9), 8);
test('closest sign can be the root', () => findClosestAddress(sign(8, sign(3), sign(11)), 7), 8);
test('deep candidate beats earlier lead', () => findClosestAddress(sign(15, sign(10, sign(8), sign(12)), sign(20, sign(17), sign(25))), 13), 12);
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
