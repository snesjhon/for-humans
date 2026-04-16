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
    crease = crease.next as ListNode;      // crease hand moves one tag
    scout = scout.next.next;               // scout hand jumps two tags
  }

  // ✓ Step 1: Cut after the crease to separate front and tail strands
  let tailRibbon: ListNode | null = crease.next;
  crease.next = null;

  // Step 2: Flip the tail so the last tag becomes the head of the returning strand
  let returnRibbon: ListNode | null = null;
  while (tailRibbon !== null) {
    const nextTail = tailRibbon.next;      // save the rest of the unflipped tail
    tailRibbon.next = returnRibbon;        // flip this tag back toward the front
    returnRibbon = tailRibbon;             // grow the returning strand
    tailRibbon = nextTail;                 // keep walking down the old tail
  }

  // Step 2: Lace one front tag with one returning tag until the return strand is empty
  let frontRibbon: ListNode | null = head;
  while (frontRibbon !== null && returnRibbon !== null) {
    const nextFront: ListNode | null = frontRibbon.next; // save the next front tag before rewiring
    const nextReturn = returnRibbon.next;  // save the rest of the returning strand

    frontRibbon.next = returnRibbon;       // place the next returning tag after the front tag
    returnRibbon.next = nextFront;         // reconnect back to the front strand

    frontRibbon = nextFront;               // advance one step in the front strand
    returnRibbon = nextReturn;             // advance one step in the returning strand
  }
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
