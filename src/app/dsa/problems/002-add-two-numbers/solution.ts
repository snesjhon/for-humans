// =============================================================================
// Add Two Numbers — Complete Solution
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

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // Blank starter stub — gives the answer roll a safe place to clip the first stamped box
  const starterStub = new ListNode(-1);
  let answerTail = starterStub;
  let overflowSatchel = 0; // carried value from the previous column

  // Keep stamping while either receipt roll still has boxes or the satchel still has overflow
  while (l1 !== null || l2 !== null || overflowSatchel !== 0) {
    const leftDigit = l1 !== null ? l1.val : 0; // empty left roll contributes 0
    const rightDigit = l2 !== null ? l2.val : 0; // empty right roll contributes 0
    const columnTotal = leftDigit + rightDigit + overflowSatchel;

    answerTail.next = new ListNode(columnTotal % 10); // stamp the ones digit for this column
    answerTail = answerTail.next; // move the clip point to the end of the answer roll
    overflowSatchel = Math.floor(columnTotal / 10); // keep the carry for the next column

    if (l1 !== null) {
      l1 = l1.next; // walk forward on the left receipt roll
    }
    if (l2 !== null) {
      l2 = l2.next; // walk forward on the right receipt roll
    }
  }

  return starterStub.next; // tear off the blank starter stub
}

// Tests — all must print PASS
runTest('both single zero digits', () => listToArray(addTwoNumbers(createList([0]), createList([0]))), [0]);
runTest('same length without carry', () => listToArray(addTwoNumbers(createList([2, 4, 3]), createList([5, 4, 1]))), [7, 8, 4]);
runTest('different lengths without carry', () => listToArray(addTwoNumbers(createList([1, 2]), createList([3]))), [4, 2]);
runTest('example 1', () => listToArray(addTwoNumbers(createList([2, 4, 3]), createList([5, 6, 4]))), [7, 0, 8]);
runTest('both zero', () => listToArray(addTwoNumbers(createList([0]), createList([0]))), [0]);
runTest('carry extends answer by one digit', () => listToArray(addTwoNumbers(createList([9, 9, 9]), createList([1]))), [0, 0, 0, 1]);
runTest('one roll ends early but carry continues', () => listToArray(addTwoNumbers(createList([9, 9]), createList([1]))), [0, 0, 1]);
runTest('leetcode example 3', () => listToArray(addTwoNumbers(createList([9, 9, 9, 9, 9, 9, 9]), createList([9, 9, 9, 9]))), [8, 9, 9, 9, 0, 0, 0, 1]);
runTest('uneven lengths without final carry', () => listToArray(addTwoNumbers(createList([1, 8]), createList([0]))), [1, 8]);

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
