// =============================================================================
// Linked Lists — Level 2, Exercise 2: Clip a Car After an Anchor
// =============================================================================
// Goal: Practice the second core doubly linked list move by inserting a node
// directly after a known anchor.
//
// You are given an anchor node already inside a doubly linked chain, plus a
// detached node. Insert the detached node immediately after the anchor.
//
// Rewire all four affected pointers:
// - anchor.next
// - node.prev
// - node.next
// - the old next node's prev
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

function insertAfter(anchor: DListNode, node: DListNode): void {
  throw new Error('not implemented');
}

test('insert X after the head sentinel', () => {
  const { head, tail } = buildChain(['A', 'B']);
  insertAfter(head, new DListNode('X'));
  return snapshot(head, tail);
}, ['H', 'X', 'A', 'B', 'T']);

test('insert X between A and B', () => {
  const { head, tail, nodes } = buildChain(['A', 'B']);
  insertAfter(nodes[0], new DListNode('X'));
  return snapshot(head, tail);
}, ['H', 'A', 'X', 'B', 'T']);

test('insert X right before the tail sentinel', () => {
  const { head, tail, nodes } = buildChain(['A', 'B']);
  insertAfter(nodes[1], new DListNode('X'));
  return snapshot(head, tail);
}, ['H', 'A', 'B', 'X', 'T']);

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
