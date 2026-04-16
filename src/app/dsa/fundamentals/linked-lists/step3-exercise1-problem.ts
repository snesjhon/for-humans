// Goal: Practice in-place pointer rewiring by reversing the first k cars.
//
// Reverse the order of the first k cars in the train.
// Leave all cars after position k untouched and still attached.
// Return the new head of the train (which was the kth car before reversal).
//
// Use the save → rewire → advance pattern exactly k times.
// After reversal, the original head is now the kth car — attach curr to it.
//
// Example:
//   reverseFirstK(1 → 2 → 3 → 4 → 5, 3)  → 3 → 2 → 1 → 4 → 5
//   reverseFirstK(1 → 2 → 3, 3)           → 3 → 2 → 1
//   reverseFirstK(1 → 2 → 3, 1)           → 1 → 2 → 3
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

function reverseFirstK(head: ListNode | null, k: number): ListNode | null {
  throw new Error('not implemented');
}

// ---Tests
test('reverse first 3 of 5',  () => toArray(reverseFirstK(buildList([1,2,3,4,5]), 3)), [3,2,1,4,5]);
// ---End Tests
test('reverse entire list',   () => toArray(reverseFirstK(buildList([1,2,3]), 3)),     [3,2,1]);
test('reverse just 1 (noop)', () => toArray(reverseFirstK(buildList([1,2,3,4,5]), 1)), [1,2,3,4,5]);
test('reverse first 2',       () => toArray(reverseFirstK(buildList([1,2,3,4,5]), 2)), [2,1,3,4,5]);
test('single car k=1',        () => toArray(reverseFirstK(buildList([7]), 1)),         [7]);

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
    } else { throw e; }
  }
}
