// Goal: Add only the addresses that fall inside an inclusive range.
//
// Return the sum of values between low and high, inclusive.
// Use BST pruning to avoid exploring roads that cannot contribute.
// If no address is in range, return 0.
//
// Example:
//   sumAddressesInRange(sign(8, sign(3), sign(11)), 4, 12) → 19
//   sumAddressesInRange(sign(8, sign(3), sign(11)), 12, 20) → 0
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function sumAddressesInRange(
  root: TreeNode | null,
  low: number,
  high: number,
): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty town sums to zero', () => sumAddressesInRange(null, 4, 12), 0);
test('single sign inside range contributes once', () => sumAddressesInRange(sign(8), 8, 8), 8);
test('single sign outside range contributes nothing', () => sumAddressesInRange(sign(8), 9, 10), 0);
test('mixed town sums middle window', () => sumAddressesInRange(sign(8, sign(3, sign(1), sign(6)), sign(11, sign(9), sign(14))), 5, 12), 34);
test('full range sums every sign', () => sumAddressesInRange(sign(10, sign(5, sign(2), sign(7)), sign(15, sign(12), sign(18))), -10, 30), 69);
test('narrow range can hit one internal sign', () => sumAddressesInRange(sign(10, sign(5, sign(2), sign(7)), sign(15, sign(12), sign(18))), 11, 12), 12);
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
