// Goal: Flip the tail into a returning strand, then lace it into the front
// strand one tag at a time.

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

function reorderList(head: ListNode | null): void {
  // ✓ Step 1: Short ribbons already match the target pattern
  if (head === null || head.next === null || head.next.next === null) {
    return;
  }

  // ✓ Step 1: Find the crease with slow and fast hands
  let crease: ListNode = head;
  let scout: ListNode | null = head;

  while (scout.next !== null && scout.next.next !== null) {
    crease = crease.next as ListNode;
    scout = scout.next.next;
  }

  // ✓ Step 1: Cut after the crease to separate front and tail strands
  const tailStart = crease.next;
  crease.next = null;

  void tailStart;
  throw new Error('not implemented');
}

runCase('null ribbon stays null', () => {
  const head = createList([]);
  reorderList(head);
  return listToArray(head);
}, []);

runCase('single tag stays put', () => {
  const head = createList([1]);
  reorderList(head);
  return listToArray(head);
}, [1]);

runCase('example with even number of tags', () => {
  const head = createList([1, 2, 3, 4]);
  reorderList(head);
  return listToArray(head);
}, [1, 4, 2, 3]);

runCase('example with odd number of tags', () => {
  const head = createList([1, 2, 3, 4, 5]);
  reorderList(head);
  return listToArray(head);
}, [1, 5, 2, 4, 3]);

runCase('three tags reorder around the middle', () => {
  const head = createList([1, 2, 3]);
  reorderList(head);
  return listToArray(head);
}, [1, 3, 2]);

// ---Helpers

function createList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  for (const value of values) {
    cur.next = new ListNode(value);
    cur = cur.next;
  }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const values: number[] = [];
  let cur = head;
  while (cur) {
    values.push(cur.val);
    cur = cur.next;
  }
  return values;
}

function runCase(desc: string, fn: () => unknown, expected: unknown): void {
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
