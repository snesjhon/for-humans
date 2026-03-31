// =============================================================================
// Linked Lists — Level 3, Exercise 2: Reverse from a Position — SOLUTION
// =============================================================================
// Goal: Combine sentinel-based walking with in-place reversal of a suffix.
//
// Walk a sentinel pos-1 steps to reach beforeStart.
// Reverse everything from beforeStart.next to the end.
// Reconnect: beforeStart.next = prev (new head of reversed segment).
// The original first node of the segment becomes the tail (its .next was set to
// null on the very first reversal step, so no extra reconnection needed).
// =============================================================================
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseFrom(head: ListNode | null, pos: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let beforeStart: ListNode = dummy;
  for (let i = 1; i < pos; i++) {
    if (!beforeStart.next) return dummy.next;
    beforeStart = beforeStart.next;
  }
  // Reverse from beforeStart.next to end
  let prev: ListNode | null = null;
  let curr: ListNode | null = beforeStart.next;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  beforeStart.next = prev;
  return dummy.next;
}

test('reverse from position 3', () => toArray(reverseFrom(buildList([1,2,3,4,5]), 3)), [1,2,5,4,3]);
test('reverse from position 1', () => toArray(reverseFrom(buildList([1,2,3,4,5]), 1)), [5,4,3,2,1]);
test('reverse from position 2', () => toArray(reverseFrom(buildList([1,2,3]), 2)),     [1,3,2]);
test('reverse last car only',   () => toArray(reverseFrom(buildList([1,2,3,4,5]), 5)), [1,2,3,4,5]);
test('single car pos 1',        () => toArray(reverseFrom(buildList([1]), 1)),         [1]);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildList(values: number[]): ListNode | null {
  if (values.length === 0) return null;
  const head = new ListNode(values[0]);
  let curr = head;
  for (let i = 1; i < values.length; i++) {
    curr.next = new ListNode(values[i]);
    curr = curr.next;
  }
  return head;
}

function toArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr: ListNode | null = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
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
