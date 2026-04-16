// Goal: Practice the fast/slow pointer technique by finding the middle node.
//
// Both conductors start at head. Loop while fast && fast.next.
// Each step: slow = slow.next; fast = fast.next.next.
// When the loop exits, slow is at the middle (second middle for even length).
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

function middleValue(head: ListNode): number {
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  return slow.val;
}

// ---Tests
test('odd length 3',   () => middleValue(buildList([1,2,3])!),       2);
// ---End Tests
test('odd length 5',   () => middleValue(buildList([1,2,3,4,5])!),   3);
test('even length 2',  () => middleValue(buildList([1,2])!),         2);
test('even length 4',  () => middleValue(buildList([1,2,3,4])!),     3);
test('single car',     () => middleValue(buildList([7])!),           7);

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
