// =============================================================================
// Reverse Linked List — Complete Solution
// =============================================================================

// ---Helpers

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// ---End Helpers

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;   // edge of town — where the reversed chain begins
  let curr: ListNode | null = head;   // crew starts at the first intersection

  while (curr !== null) {
    const next = curr.next;   // open the notebook — record forward path before flipping
    curr.next = prev;         // flip the sign — redirect this intersection back to prev
    prev = curr;              // raise the flag at the current intersection
    curr = next;              // advance using the notebook entry
  }

  return prev; // prev is the old last stop — now the new head of the reversed list
}

// Tests — all must print PASS
test('empty list returns null', () => reverseList(null), null);
test('single node', () => listToArray(reverseList(createList([1]))), [1]);
test('two nodes', () => listToArray(reverseList(createList([1, 2]))), [2, 1]);
test('three nodes', () => listToArray(reverseList(createList([1, 2, 3]))), [3, 2, 1]);
test('five nodes', () => listToArray(reverseList(createList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);

// ---Helpers

function createList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of values) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const r: number[] = [];
  let cur = head;
  while (cur) { r.push(cur.val); cur = cur.next; }
  return r;
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
