// Goal: Place the sentinel engine and coupling hook, build the structural frame
// (while loop gate + tail attachment), and return sentinel.next.
//
// Step 1 handles the cases where at least one train arrives empty — the loop
// never enters, and the tail attachment correctly chains whatever remains.

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

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  throw new Error('not implemented');
}

// ---Tests
test('both lists empty', () => listToArray(mergeTwoLists(null, null)), []);
// ---End Tests
test('first list empty', () => listToArray(mergeTwoLists(null, createList([1]))), [1]);
test('second list empty', () => listToArray(mergeTwoLists(createList([1]), null)), [1]);

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
