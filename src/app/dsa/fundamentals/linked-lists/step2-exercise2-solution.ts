// Goal: Use fast/slow pointers to determine the parity of the train's length.
//
// Run the standard fast/slow loop. After it exits:
//   fast === null  → even length (fast stepped off the end)
//   fast !== null  → odd length  (fast is on the last car)
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
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    fast = fast.next.next;
  }
  return fast === null;
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
