// =============================================================================
// Linked Lists — Level 3, Exercise 2: Reverse from a Position
// =============================================================================
// Goal: Combine sentinel-based walking with in-place reversal of a suffix.
//
// Given the head of a train and a 1-indexed position pos, reverse all cars
// from position pos to the end of the train. Cars before pos are unchanged.
// Return the new head of the train.
//
// Steps:
//   1. Walk a sentinel to the node just before position pos (the beforeStart).
//   2. Save the node at pos as segHead — it will become the tail of the reversed segment.
//   3. Reverse all cars from segHead to the end.
//   4. Reconnect: beforeStart.next = prev (new head of segment).
//      segHead.next is already null after reversal (it was the first node reversed).
//
// Example:
//   reverseFrom(1 → 2 → 3 → 4 → 5, 3)  → 1 → 2 → 5 → 4 → 3
//   reverseFrom(1 → 2 → 3 → 4 → 5, 1)  → 5 → 4 → 3 → 2 → 1
//   reverseFrom(1 → 2 → 3, 2)           → 1 → 3 → 2
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
  throw new Error('not implemented');
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
