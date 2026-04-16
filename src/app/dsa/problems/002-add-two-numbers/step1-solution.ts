// Goal: Build the answer-roll scaffolding and stamp one digit per column for
// cases where no column total ever reaches 10.

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
  // Blank starter stub — gives the answer roll a fixed clip point
  const starterStub = new ListNode(-1);
  let answerTail = starterStub;

  while (l1 !== null || l2 !== null) {
    const leftDigit = l1 !== null ? l1.val : 0;
    const rightDigit = l2 !== null ? l2.val : 0;
    const stampedDigit = leftDigit + rightDigit; // Step 1 assumes the satchel stays empty

    answerTail.next = new ListNode(stampedDigit); // stamp one finished box onto the answer roll
    answerTail = answerTail.next;

    if (l1 !== null) {
      l1 = l1.next; // move down the left receipt roll
    }
    if (l2 !== null) {
      l2 = l2.next; // move down the right receipt roll
    }
  }

  return starterStub.next;
}

runTest('both single zero digits', () => listToArray(addTwoNumbers(createList([0]), createList([0]))), [0]);
runTest('same length without carry', () => listToArray(addTwoNumbers(createList([2, 4, 3]), createList([5, 4, 1]))), [7, 8, 4]);
runTest('different lengths without carry', () => listToArray(addTwoNumbers(createList([1, 2]), createList([3]))), [4, 2]);

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
