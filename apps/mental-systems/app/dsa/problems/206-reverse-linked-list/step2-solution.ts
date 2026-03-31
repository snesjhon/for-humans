// =============================================================================
// Reverse Linked List — Step 2 of 2: The Three-Step Sign-Flipping Dance — SOLUTION
// =============================================================================
// Goal: Inside the loop, execute the three operations in strict order:
//       save the notebook, flip the sign, advance both markers.

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  // ✓ Step 1: Road markers — edge of town and first intersection
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr !== null) {
    const next = curr.next;   // open the notebook — record forward path before flipping
    curr.next = prev;         // flip the sign — point this intersection back to prev
    prev = curr;              // raise the flag at this intersection
    curr = next;              // advance to the next intersection (from notebook)
  }

  return prev; // crew finished — prev is the old last stop, now the new head
}

// Tests — all must print PASS
test('empty list returns null', () => reverseList(null), null);
test('single node', () => listToArray(reverseList(createList([1]))), [1]);
test('two nodes', () => listToArray(reverseList(createList([1, 2]))), [2, 1]);
test('five nodes', () => listToArray(reverseList(createList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of values) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const r: number[] = [];
  let cur = head;
  while (cur) { r.push(cur.val); cur = cur.next; }
  return r;
}

function test(desc: string, fn: () => unknown, expected: unknown): void {
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
    } else { throw e; }
  }
}
