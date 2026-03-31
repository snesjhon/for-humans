// =============================================================================
// Reverse Linked List — Step 1 of 2: Setting Up the Road Markers — SOLUTION
// =============================================================================
// Goal: Initialize prev=null (edge of town) and curr=head (first intersection),
//       and set up the loop shell that drives the crew forward.

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;   // edge of town — no previous intersection yet
  let curr: ListNode | null = head;   // crew starts at the first intersection

  while (curr !== null) {
    const next = curr.next;   // note where the sign points before flipping
    curr.next = prev;         // flip the sign to point backward
    prev = curr;              // raise the flag at the current intersection
    curr = next;              // advance to the next intersection (from notebook)
  }

  return prev; // crew is done — prev is the last intersection, now the new head
}

// Tests — all must print PASS
test('empty list returns null', () => reverseList(null), null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

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
