// Goal: Find where the ribbon folds so short ribbons stay unchanged and longer
// ribbons can be split into a front strand and a tail strand.

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

runCase('two tags stay in the same order', () => {
  const head = createList([1, 2]);
  reorderList(head);
  return listToArray(head);
}, [1, 2]);

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
