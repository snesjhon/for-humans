// Goal: Use fast/slow pointers to determine the parity of the train's length
//       without counting every car.
//
// Return true if the train has an even number of cars, false if odd.
// An empty train (null) has 0 cars — 0 is even, so return true.
//
// Insight: after the fast/slow loop completes, if fast landed on null the
// length is even; if fast is on a node the length is odd.
//
// Example:
//   isEvenLength(1 → 2 → 3 → 4)  → true
//   isEvenLength(1 → 2 → 3)       → false
//   isEvenLength(null)             → true
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

function isEvenLength(head: ListNode | null): boolean {
  throw new Error('not implemented');
}

// ---Tests
test('empty train',    () => isEvenLength(null),                    true);
// ---End Tests
test('one car',        () => isEvenLength(buildList([1])),          false);
test('two cars',       () => isEvenLength(buildList([1,2])),        true);
test('three cars',     () => isEvenLength(buildList([1,2,3])),      false);
test('four cars',      () => isEvenLength(buildList([1,2,3,4])),    true);
test('five cars',      () => isEvenLength(buildList([1,2,3,4,5])), false);

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
