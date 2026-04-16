// Goal: Compare the two front cars and couple the lighter one each iteration.

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
  // ✓ Step 1: Sentinel engine — gives tail a valid attachment point
  const sentinel = new ListNode(-1);
  let tail = sentinel;

  // ✓ Step 2: The coupling decision — always couple the lighter front car
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;      // couple list1's front car
      list1 = list1.next;     // list1 train advances one car
    } else {
      tail.next = list2;      // couple list2's front car
      list2 = list2.next;     // list2 train advances one car
    }
    tail = tail.next!;        // coupling hook advances to the node just attached
  }

  // ✓ Step 1: Hitch the remaining train (already sorted)
  tail.next = list1 !== null ? list1 : list2;
  return sentinel.next;
}

// ---Tests
test('both lists empty', () => listToArray(mergeTwoLists(null, null)), []);
// ---End Tests
test('first list empty', () => listToArray(mergeTwoLists(null, createList([1]))), [1]);
test('second list empty', () => listToArray(mergeTwoLists(createList([1]), null)), [1]);
test('example 1', () => listToArray(mergeTwoLists(createList([1, 2, 4]), createList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]);
test('equal single nodes', () => listToArray(mergeTwoLists(createList([1]), createList([1]))), [1, 1]);
test('list2 entirely smaller', () => listToArray(mergeTwoLists(createList([5]), createList([1, 2, 3]))), [1, 2, 3, 5]);

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
