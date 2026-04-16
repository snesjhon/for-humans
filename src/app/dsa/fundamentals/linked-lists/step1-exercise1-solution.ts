// Goal: Practice basic linked list traversal by walking the train car by car.
//
// Walk from head to null, incrementing a counter at each car.
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

function countNodes(head: ListNode | null): number {
  let count = 0;
  let curr: ListNode | null = head;
  while (curr !== null) {
    count++;
    curr = curr.next;
  }
  return count;
}

// ---Tests
test('empty train', () => countNodes(null), 0);
// ---End Tests
test('single car', () => countNodes(buildList([1])), 1);
test('three cars', () => countNodes(buildList([1, 2, 3])), 3);
test('five cars', () => countNodes(buildList([1, 2, 3, 4, 5])), 5);
test('two cars', () => countNodes(buildList([7, 8])), 2);

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
    } else {
      throw e;
    }
  }
}
