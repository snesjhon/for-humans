// Goal: Each lap, advance the jogger one step and the sprinter two steps.
//       If they ever land on the same node, the track loops — return true.

// ---Helpers

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// ---End Helpers

function hasCycle(head: ListNode | null): boolean {
  // ✓ Step 1: Place runners at the starting line (locked)
  let slow = head; // jogger: one step per lap
  let fast = head; // sprinter: two steps per lap
  while (fast !== null && fast.next !== null) {
    // Step 2: Run the race — advance both, then check if they've met
    slow = (slow as ListNode).next;  // jogger takes one step
    fast = fast.next.next;           // sprinter takes two steps
    if (slow === fast) return true;  // same node — cycle confirmed
  }
  return false; // sprinter hit the end — no cycle
}

// ---Tests
test('empty list has no cycle', () => hasCycle(null), false);
// ---End Tests
test('single node with no self-link has no cycle', () => hasCycle(createCycle([1], -1)), false);
test('two-node list with no cycle', () => hasCycle(createCycle([1, 2], -1)), false);
test('[3,2,0,-4] with tail to index 1 has a cycle', () => hasCycle(createCycle([3, 2, 0, -4], 1)), true);
test('[1,2] with tail to index 0 has a cycle', () => hasCycle(createCycle([1, 2], 0)), true);

// ---Helpers

function createCycle(values: number[], pos: number): ListNode | null {
  if (values.length === 0) return null;
  const nodes: ListNode[] = values.map(v => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0];
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
