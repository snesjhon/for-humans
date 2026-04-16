// Goal: Practice the N-apart pointer technique with a fixed gap of 3.
//
// Return the cargo value of the car that is 3 positions from the end of the train
// (i.e., the car with exactly 2 cars after it).
// If the train has fewer than 3 cars, return -1.
//
// Use two pointers: advance the lead 3 steps first, then advance both in lockstep.
// When lead reaches null, the trailer is at the 3rd car from the end.
//
// Example:
//   thirdFromEnd(1 → 2 → 3 → 4 → 5)  → 3    (5 is 1st, 4 is 2nd, 3 is 3rd)
//   thirdFromEnd(1 → 2 → 3)           → 1    (3 is 1st, 2 is 2nd, 1 is 3rd)
//   thirdFromEnd(1 → 2)               → -1
// ---Helpers

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// ---End Helpers

function thirdFromEnd(head: ListNode | null): number {
  throw new Error('not implemented');
}

// ---Tests
test('five cars',       () => thirdFromEnd(buildList([1,2,3,4,5])),   3);
// ---End Tests
test('four cars',       () => thirdFromEnd(buildList([1,2,3,4])),     2);
test('exactly 3 cars',  () => thirdFromEnd(buildList([1,2,3])),       1);
test('two cars',        () => thirdFromEnd(buildList([1,2])),         -1);
test('one car',         () => thirdFromEnd(buildList([1])),           -1);
test('empty train',     () => thirdFromEnd(null),                    -1);

// ---Helpers
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
