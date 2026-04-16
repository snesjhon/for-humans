// Goal: Combine fast/slow pointers and in-place reversal to check symmetry.
//
// Step 1: Find the middle using fast/slow (slow ends at second middle for even).
// Step 2: Reverse from slow to end — prev becomes the new head of second half.
// Step 3: Walk left from head and right from prev simultaneously.
//         Any mismatch → return false. Exhaust right → return true.
// ---Helpers

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// ---End Helpers

function isPalindrome(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;

  // Step 1: find middle
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // Step 2: reverse second half starting from slow
  let prev: ListNode | null = null;
  let curr: ListNode | null = slow;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // Step 3: compare left and right halves
  let left: ListNode | null = head;
  let right: ListNode | null = prev;
  while (right !== null) {
    if (left!.val !== right.val) return false;
    left = left!.next;
    right = right.next;
  }
  return true;
}

// ---Tests
test('even palindrome',     () => isPalindrome(buildList([1,2,2,1])),       true);
// ---End Tests
test('odd palindrome',      () => isPalindrome(buildList([1,2,3,2,1])),     true);
test('single car',          () => isPalindrome(buildList([5])),             true);
test('identical pair',      () => isPalindrome(buildList([3,3])),           true);
test('two different',       () => isPalindrome(buildList([1,2])),           false);
test('odd non-palindrome',  () => isPalindrome(buildList([1,2,3])),         false);

// ---Helpers
function buildList(values: number[]): ListNode | null {
  if (values.length === 0) return null;
  const head = new ListNode(values[0]);
  let curr = head;
  for (let i = 1; i < values.length; i++) {
    curr.next = new ListNode(values[i]);
    curr = curr.next;
  }
  return head;
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
