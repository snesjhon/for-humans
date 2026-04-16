// =============================================================================
// Reorder List — Complete Solution
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

function reorderList(head: ListNode | null): void {
  if (head === null || head.next === null || head.next.next === null) {
    return; // ribbons with fewer than three tags already match the target pattern
  }

  let crease: ListNode = head;      // crease hand walks one tag at a time
  let scout: ListNode | null = head; // scout hand jumps two tags to find the fold
  while (scout.next !== null && scout.next.next !== null) {
    crease = crease.next as ListNode; // scout reaching the end means crease found the fold
    scout = scout.next.next;
  }

  let tailRibbon: ListNode | null = crease.next; // the tail begins just after the crease
  crease.next = null;                            // cut the ribbon into front and tail strands

  let returnRibbon: ListNode | null = null;     // flipped tail becomes the returning strand
  while (tailRibbon !== null) {
    const nextTail = tailRibbon.next;           // save the unflipped remainder of the tail
    tailRibbon.next = returnRibbon;             // flip this tag back toward the front
    returnRibbon = tailRibbon;                  // grow the returning strand from the old end
    tailRibbon = nextTail;                      // continue down the original tail
  }

  let frontRibbon: ListNode | null = head;      // start weaving from the front strand
  while (frontRibbon !== null && returnRibbon !== null) {
    const nextFront: ListNode | null = frontRibbon.next; // save the next front tag before rewiring
    const nextReturn = returnRibbon.next;       // save the rest of the returning strand

    frontRibbon.next = returnRibbon;            // lace in one returning tag after one front tag
    returnRibbon.next = nextFront;              // reconnect back to the front strand

    frontRibbon = nextFront;                    // advance in the front strand
    returnRibbon = nextReturn;                  // advance in the returning strand
  }
}

// Tests — all must print PASS
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

runCase('six tags alternate from both ends', () => {
  const head = createList([1, 2, 3, 4, 5, 6]);
  reorderList(head);
  return listToArray(head);
}, [1, 6, 2, 5, 3, 4]);

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
