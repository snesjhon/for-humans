// Goal: Practice following one rope path at a time through an adjacency-list graph.
//
// Return the nodes in the exact order a recursive DFS visits them from the start node.
//
// Example:
//   dfsVisitOrder([[1,2],[3],[],[]], 0) -> [0,1,3,2]
//   dfsVisitOrder([[],[2],[3],[]], 1)   -> [1,2,3]
function dfsVisitOrder(graph: number[][], start: number): number[] {
  throw new Error('not implemented');
}

// ---Tests
test(
  'records recursive DFS order from the start node',
  () => dfsVisitOrder([[1, 2], [3], [], []], 0),
  [0, 1, 3, 2],
);
test(
  'starts in the middle of the graph',
  () => dfsVisitOrder([[], [2], [3], []], 1),
  [1, 2, 3],
);
test(
  'returns only the reachable nodes from the chosen start',
  () => dfsVisitOrder([[1], [], [3], []], 0),
  [0, 1],
);
test(
  'skips revisiting nodes through a cycle',
  () => dfsVisitOrder([[1], [2], [0, 3], []], 0),
  [0, 1, 2, 3],
);
test(
  'returns an empty order for an invalid start',
  () => dfsVisitOrder([[1], []], 5),
  [],
);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers
