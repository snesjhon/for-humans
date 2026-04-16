// Goal: After the scout gap is set, walk both workers together until the remover
// stands right before the target car, then skip it.

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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // ✓ Step 1: Platform marker — safe standing spot before the first real car
  const platform = new ListNode(0, head);
  let scout: ListNode | null = platform;
  let remover: ListNode | null = platform;

  // ✓ Step 1: Scout gap — send the scout n + 1 steps ahead
  for (let gapStep = 0; gapStep <= n; gapStep += 1) {
    scout = scout!.next;
  }

  // Step 2: Synchronized walk — preserve the gap until the scout leaves the train
  while (scout !== null) {
    scout = scout.next;          // scout keeps the forward lead
    remover = remover!.next;     // remover follows into the uncoupling spot
  }

  // Step 2: Uncouple the target car by skipping the connector after remover
  remover!.next = remover!.next!.next;
  return platform.next;
}

runCase('single car removed', () => listToArray(removeNthFromEnd(createList([1]), 1)), []);
runCase('remove head from two-car train', () => listToArray(removeNthFromEnd(createList([1, 2]), 2)), [2]);
runCase('example 1', () => listToArray(removeNthFromEnd(createList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
runCase('remove tail', () => listToArray(removeNthFromEnd(createList([1, 2]), 1)), [1]);
runCase('remove middle car', () => listToArray(removeNthFromEnd(createList([1, 2, 3]), 2)), [1, 3]);

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
