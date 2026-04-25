// Goal: Handle the empty room — if root is null, return null immediately.
//       A null node has no doors to swap. This is where the recursion stops.

// ---Helpers

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// ---End Helpers

function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  throw new Error('not implemented');
}

// ---Tests
test('empty tree returns null', () => invertTree(null), null);
// ---End Tests

// ---Helpers

function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length && queue.length > 0) {
    const node = queue.shift()!;
    if (i < vals.length && vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const result: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  while (q.length > 0) {
    const node = q.shift()!;
    if (node === null) { result.push(null); continue; }
    result.push(node.val);
    q.push(node.left);
    q.push(node.right);
  }
  while (result.length > 0 && result[result.length - 1] === null) result.pop();
  return result;
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
    } else { throw e; }
  }
}
