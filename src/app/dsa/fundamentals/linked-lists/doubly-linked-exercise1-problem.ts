// =============================================================================
// Linked Lists — Level 2, Exercise 1: Unclip a Known Car
// =============================================================================
// Goal: Practice the core doubly linked list move by detaching a known node
// from the middle of the chain.
//
// You are given a direct pointer to a real car in a doubly linked train.
// The car is guaranteed to have both neighbors already connected.
// Remove that car from the chain by rewiring its neighbors directly.
//
// Do not scan from the head. The whole point is that the car already knows
// both sides through `.prev` and `.next`.
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

function detach(node: DListNode): void {
  throw new Error('not implemented');
}

test('detach middle car B from H <-> A <-> B <-> C <-> T', () => {
  const { head, tail, nodes } = buildChain(['A', 'B', 'C']);
  detach(nodes[1]);
  return snapshot(head, tail);
}, ['H', 'A', 'C', 'T']);

test('detach first real car', () => {
  const { head, tail, nodes } = buildChain(['A', 'B', 'C']);
  detach(nodes[0]);
  return snapshot(head, tail);
}, ['H', 'B', 'C', 'T']);

test('detach last real car', () => {
  const { head, tail, nodes } = buildChain(['A', 'B', 'C']);
  detach(nodes[2]);
  return snapshot(head, tail);
}, ['H', 'A', 'B', 'T']);

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
