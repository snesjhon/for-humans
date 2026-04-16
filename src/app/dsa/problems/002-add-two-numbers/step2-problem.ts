// Goal: Add the overflow satchel so each column can stamp the ones digit now
// and carry any extra 1 into the next column.

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

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // ✓ Step 1: Blank starter stub and answer clip point (locked)
  const starterStub = new ListNode(-1);
  let answerTail = starterStub;

  while (l1 !== null || l2 !== null) {
    const leftDigit = l1 !== null ? l1.val : 0;
    const rightDigit = l2 !== null ? l2.val : 0;

    throw new Error('not implemented');
  }

  return starterStub.next;
}

runTest('both single zero digits', () => listToArray(addTwoNumbers(createList([0]), createList([0]))), [0]);
runTest('same length without carry', () => listToArray(addTwoNumbers(createList([2, 4, 3]), createList([5, 4, 1]))), [7, 8, 4]);
runTest('different lengths without carry', () => listToArray(addTwoNumbers(createList([1, 2]), createList([3]))), [4, 2]);
runTest('example 1', () => listToArray(addTwoNumbers(createList([2, 4, 3]), createList([5, 6, 4]))), [7, 0, 8]);
runTest('carry extends answer by one digit', () => listToArray(addTwoNumbers(createList([9, 9, 9]), createList([1]))), [0, 0, 0, 1]);
runTest('one roll ends early but carry continues', () => listToArray(addTwoNumbers(createList([9, 9]), createList([1]))), [0, 0, 1]);

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
  const digits: number[] = [];
  let cur = head;
  while (cur !== null) {
    digits.push(cur.val);
    cur = cur.next;
  }
  return digits;
}

function runTest(desc: string, fn: () => unknown, expected: unknown): void {
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
