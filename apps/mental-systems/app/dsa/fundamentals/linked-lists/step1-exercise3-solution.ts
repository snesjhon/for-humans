// =============================================================================
// Linked Lists — Level 1, Exercise 3: Hitch a New Car — SOLUTION
// =============================================================================
// Goal: Practice sentinel-based insertion at an arbitrary position.
//
// Attach a sentinel before head. Walk k steps from the sentinel.
// If curr.next is null before k steps complete, stop early (insert at end).
// Splice the new node in: newNode.next = curr.next; curr.next = newNode.
// Return dummy.next.
// =============================================================================
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function insertAt(head: ListNode | null, k: number, val: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let curr: ListNode = dummy;
  for (let i = 0; i < k; i++) {
    if (curr.next === null) break;
    curr = curr.next;
  }
  const newNode = new ListNode(val);
  newNode.next = curr.next;
  curr.next = newNode;
  return dummy.next;
}

test('insert in middle',     () => toArray(insertAt(buildList([1,2,3]), 1, 99)),   [1,99,2,3]);
test('insert at front',      () => toArray(insertAt(buildList([1,2,3]), 0, 99)),   [99,1,2,3]);
test('insert at end',        () => toArray(insertAt(buildList([1,2,3]), 3, 99)),   [1,2,3,99]);
test('insert beyond length', () => toArray(insertAt(buildList([1,2,3]), 10, 99)),  [1,2,3,99]);
test('insert into empty',    () => toArray(insertAt(null, 0, 5)),                 [5]);
test('insert single at end', () => toArray(insertAt(buildList([1]), 1, 2)),       [1,2]);

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function toArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr: ListNode | null = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
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
