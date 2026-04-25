// Goal: Practice grouping zero-arrow intersections into parallel dispatch waves.
//
// Return the topological layers, where each inner array contains the intersections
// that can be processed in the same round. If a cycle exists, return an empty array.
//
// Example:
//   dispatchWaves(4, [[0,2],[1,2],[2,3]]) → [[0,1],[2],[3]]
//   dispatchWaves(2, [[0,1],[1,0]])       → []
type Street = [number, number];

function dispatchWaves(n: number, streets: Street[]): number[][] {
  throw new Error('not implemented');
}

// ---Tests
check('empty city has no waves', () => dispatchWaves(0, []), []);
check('independent starts share first wave', () => dispatchWaves(4, [[0, 2], [1, 2], [2, 3]]), [[0, 1], [2], [3]]);
check('single chain creates one node per wave', () => dispatchWaves(3, [[0, 1], [1, 2]]), [[0], [1], [2]]);
check('multiple later unlocks are grouped together', () => dispatchWaves(6, [[0, 3], [1, 3], [2, 4], [3, 5], [4, 5]]), [[0, 1, 2], [3, 4], [5]]);
check('cycle returns empty waves', () => dispatchWaves(3, [[0, 1], [1, 2], [2, 1]]), []);
// ---End Tests

// ---Helpers
function check(desc: string, fn: () => unknown, expected: unknown): void {
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
// ---End Helpers
