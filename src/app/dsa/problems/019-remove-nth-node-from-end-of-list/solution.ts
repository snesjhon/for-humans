// =============================================================================
// Remove Nth Node From End of List — Complete Solution
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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // Platform marker — gives the remover a safe spot before the first real car
  const platform = new ListNode(0, head);
  let scout: ListNode | null = platform;
  let remover: ListNode | null = platform;

  // Scout gap — walk n + 1 steps so remover lands before the target connector
  for (let gapStep = 0; gapStep <= n; gapStep += 1) {
    scout = scout!.next;
  }

  // Synchronized walk — keep the gap fixed until the scout leaves the train
  while (scout !== null) {
    scout = scout.next;          // scout stays ahead
    remover = remover!.next;     // remover follows into position
  }

  // Uncoupling — skip the target car by reconnecting around it
  remover!.next = remover!.next!.next;
  return platform.next;
}

// Tests — all must print PASS
runCase('single car removed', () => listToArray(removeNthFromEnd(createList([1]), 1)), []);
runCase('remove head from two-car train', () => listToArray(removeNthFromEnd(createList([1, 2]), 2)), [2]);
runCase('example 1', () => listToArray(removeNthFromEnd(createList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
runCase('remove tail', () => listToArray(removeNthFromEnd(createList([1, 2]), 1)), [1]);
runCase('remove middle car', () => listToArray(removeNthFromEnd(createList([1, 2, 3]), 2)), [1, 3]);
runCase('remove head from five-car train', () => listToArray(removeNthFromEnd(createList([1, 2, 3, 4, 5]), 5)), [2, 3, 4, 5]);
runCase('remove near tail', () => listToArray(removeNthFromEnd(createList([1, 2, 3, 4]), 2)), [1, 2, 4]);

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
