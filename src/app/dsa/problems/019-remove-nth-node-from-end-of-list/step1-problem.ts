// Goal: Place a platform marker before the train and send the scout n + 1 steps
// ahead so head-removal cases can already be solved.

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
  throw new Error('not implemented');
}

runCase('single car removed', () => listToArray(removeNthFromEnd(createList([1]), 1)), []);
runCase('remove head from two-car train', () => listToArray(removeNthFromEnd(createList([1, 2]), 2)), [2]);
runCase('remove head from three-car train', () => listToArray(removeNthFromEnd(createList([1, 2, 3]), 3)), [2, 3]);

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
