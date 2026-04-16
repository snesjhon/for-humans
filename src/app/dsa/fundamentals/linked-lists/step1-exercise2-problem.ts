// Goal: Practice the sentinel pattern by removing all matching cars from the train.
//
// You are given the head of a train and a target cargo value.
// Remove every car whose cargo equals the target and return the new head.
// Use a sentinel car so that every removal — including the locomotive — is handled
// with the same code path, with no special cases for the head.
//
// Example:
//   removeAll(1 → 3 → 3 → 4, 3)  → 1 → 4
//   removeAll(3 → 3 → 3, 3)       → null
//   removeAll(1 → 2 → 3, 9)       → 1 → 2 → 3
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

function removeAll(head: ListNode | null, target: number): ListNode | null {
  throw new Error('not implemented');
}

// ---Tests
test(
  'remove middle cars',
  () => toArray(removeAll(buildList([1, 3, 3, 4]), 3)),
  [1, 4],
);
test(
  'remove the locomotive',
  () => toArray(removeAll(buildList([3, 1, 2]), 3)),
  [1, 2],
);
test(
  'remove last car',
  () => toArray(removeAll(buildList([1, 2, 3]), 3)),
  [1, 2],
);
test('remove all cars', () => toArray(removeAll(buildList([3, 3, 3]), 3)), []);
test(
  'target not in train',
  () => toArray(removeAll(buildList([1, 2, 3]), 9)),
  [1, 2, 3],
);
test('empty train', () => toArray(removeAll(null, 1)), []);
// ---End Tests

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
    } else {
      throw e;
    }
  }
}
