// =============================================================================
// Linked Lists — Level 1, Exercise 2: Retire the Bad Cargo — SOLUTION
// =============================================================================
// Goal: Practice the sentinel pattern by removing all matching cars from the train.
//
// Attach a sentinel before head. Walk prev and curr together.
// On a match: prev.next = curr.next, advance curr only (prev stays).
// On a keep: advance prev to curr, then advance curr.
// Return dummy.next.
// =============================================================================
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function removeAll(head: ListNode | null, target: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev: ListNode = dummy;
  let curr: ListNode | null = head;
  while (curr !== null) {
    if (curr.val === target) {
      prev.next = curr.next;
    } else {
      prev = curr;
    }
    curr = curr.next;
  }
  return dummy.next;
}

test('remove middle cars',    () => toArray(removeAll(buildList([1,3,3,4]), 3)),   [1,4]);
test('remove the locomotive', () => toArray(removeAll(buildList([3,1,2]), 3)),     [1,2]);
test('remove last car',       () => toArray(removeAll(buildList([1,2,3]), 3)),     [1,2]);
test('remove all cars',       () => toArray(removeAll(buildList([3,3,3]), 3)),     []);
test('target not in train',   () => toArray(removeAll(buildList([1,2,3]), 9)),     [1,2,3]);
test('empty train',           () => toArray(removeAll(null, 1)),                  []);

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
