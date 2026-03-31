// =============================================================================
// Merge Two Sorted Lists — Step 2 of 2: The Coupling Decision
// =============================================================================
// Goal: Fill in the loop body — compare the two front cars and couple the
// lighter one onto tail, advancing that train's pointer and the tail pointer.

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // ✓ Step 1: Sentinel engine (locked)
  const sentinel = new ListNode(-1);
  let tail = sentinel;

  while (list1 !== null && list2 !== null) {
    throw new Error('not implemented');
  }

  // ✓ Step 1: Hitch the remaining train (locked)
  tail.next = list1 !== null ? list1 : list2;
  return sentinel.next;
}

// Tests
test('both lists empty', () => listToArray(mergeTwoLists(null, null)), []);
test('first list empty', () => listToArray(mergeTwoLists(null, createList([1]))), [1]);
test('second list empty', () => listToArray(mergeTwoLists(createList([1]), null)), [1]);
test('example 1', () => listToArray(mergeTwoLists(createList([1, 2, 4]), createList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]);
test('equal single nodes', () => listToArray(mergeTwoLists(createList([1]), createList([1]))), [1, 1]);
test('list2 entirely smaller', () => listToArray(mergeTwoLists(createList([5]), createList([1, 2, 3]))), [1, 2, 3, 5]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
