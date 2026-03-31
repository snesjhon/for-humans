// =============================================================================
// Linked List Cycle — Step 1 of 2: The Starting Line — SOLUTION
// =============================================================================
// Goal: Place both runners at the starting line and define when the race ends —
//       the sprinter must have at least two steps of road ahead to keep going.

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function hasCycle(head: ListNode | null): boolean {
  let slow = head; // jogger: starts at the starting line
  let fast = head; // sprinter: starts at the same spot
  while (fast !== null && fast.next !== null) {
    // race body in step 2
  }
  return false; // sprinter reached the end — no cycle
}

// Tests — all must print PASS
test('empty list has no cycle', () => hasCycle(null), false);
test('single node with no self-link has no cycle', () => hasCycle(createCycle([1], -1)), false);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
