// Goal: Combine fast/slow pointers and in-place reversal to check symmetry.
//
// Return true if the cargo values of the train read the same forwards and
// backwards. This is the composition exercise: use fast/slow to find the middle,
// reverse the second half in-place, then compare the two halves from outside in.
//
// A train with 0 or 1 cars is always a palindrome.
//
// Example:
//   isPalindrome(1 → 2 → 2 → 1)        → true
//   isPalindrome(1 → 2 → 3 → 2 → 1)    → true
//   isPalindrome(1 → 2)                 → false
//   isPalindrome(1 → 2 → 3)             → false
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
  throw new Error('not implemented');
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
