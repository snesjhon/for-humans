// =============================================================================
// Linked Lists — Level 2, Exercise 3: Reheat a Known Car
// =============================================================================
// Goal: Combine detach + insert to move a known node to the front of a doubly
// linked chain.
//
// You are given the front sentinel and a direct pointer to a real node already
// inside the chain. Move that node so it becomes the first real node after the
// front sentinel.
//
// This is the exact "move-to-front" pattern used by structures like an LRU
// cache. Do not scan. Rewire locally.
// =============================================================================
// ---Helpers

class DListNode {
  val: string;
  prev: DListNode | null = null;
  next: DListNode | null = null;

  constructor(val: string) {
    this.val = val;
  }
}

// ---End Helpers

function moveToFront(frontSentinel: DListNode, node: DListNode): void {
  throw new Error('not implemented');
}

test('move middle node B to the front', () => {
  const { head, tail, nodes } = buildChain(['A', 'B', 'C']);
  moveToFront(head, nodes[1]);
  return snapshot(head, tail);
}, ['H', 'B', 'A', 'C', 'T']);

test('move last node C to the front', () => {
  const { head, tail, nodes } = buildChain(['A', 'B', 'C']);
  moveToFront(head, nodes[2]);
  return snapshot(head, tail);
}, ['H', 'C', 'A', 'B', 'T']);

test('moving the first real node keeps the chain valid', () => {
  const { head, tail, nodes } = buildChain(['A', 'B', 'C']);
  moveToFront(head, nodes[0]);
  return snapshot(head, tail);
}, ['H', 'A', 'B', 'C', 'T']);

// ---Helpers
function buildChain(values: string[]): { head: DListNode; tail: DListNode; nodes: DListNode[] } {
  const head = new DListNode('H');
  const tail = new DListNode('T');
  const nodes = values.map((value) => new DListNode(value));

  head.next = nodes.length ? nodes[0] : tail;
  if (nodes.length) {
    nodes[0].prev = head;
    nodes[nodes.length - 1].next = tail;
    tail.prev = nodes[nodes.length - 1];
  } else {
    tail.prev = head;
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
    nodes[i + 1].prev = nodes[i];
  }

  if (!nodes.length) {
    head.next = tail;
  }

  return { head, tail, nodes };
}

function snapshot(head: DListNode, tail: DListNode): string[] {
  const values: string[] = [];
  let curr: DListNode | null = head;

  while (curr !== null) {
    values.push(curr.val);
    if (curr === tail) break;
    curr = curr.next;
  }

  return values;
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
