// =============================================================================
// Linked Lists — Level 2, Exercise 3: The Third Car from the End — SOLUTION
// =============================================================================
// Goal: Practice the N-apart pointer technique with a fixed gap of 3.
//
// Advance lead 3 steps from head. If lead ever becomes null mid-advance,
// the list has fewer than 3 cars — return -1.
// Then advance both lead and trailer in lockstep until lead === null.
// At that point trailer is at the 3rd car from the end.
// =============================================================================
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function thirdFromEnd(head: ListNode | null): number {
  let lead: ListNode | null = head;
  for (let i = 0; i < 3; i++) {
    if (lead === null) return -1;
    lead = lead.next;
  }
  let trailer: ListNode | null = head;
  while (lead !== null) {
    lead = lead.next;
    trailer = trailer!.next;
  }
  return trailer!.val;
}

test('five cars',       () => thirdFromEnd(buildList([1,2,3,4,5])),   3);
test('four cars',       () => thirdFromEnd(buildList([1,2,3,4])),     2);
test('exactly 3 cars',  () => thirdFromEnd(buildList([1,2,3])),       1);
test('two cars',        () => thirdFromEnd(buildList([1,2])),         -1);
test('one car',         () => thirdFromEnd(buildList([1])),           -1);
test('empty train',     () => thirdFromEnd(null),                    -1);

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
