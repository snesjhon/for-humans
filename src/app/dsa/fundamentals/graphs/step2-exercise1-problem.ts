// Goal: Practice counting every disconnected district in the city map.
//
// Return the number of connected components in an undirected graph.
//
// Example:
//   countDistricts(6, [[0,1],[1,2],[3,4]]) → 3
//   countDistricts(4, [[0,1],[1,2],[2,3]]) → 1
type Road = [number, number];

function countDistricts(n: number, roads: Road[]): number {
  throw new Error('not implemented');
}

// ---Tests
check('empty city has no districts', () => countDistricts(0, []), 0);
check('single chain is one district', () => countDistricts(4, [[0, 1], [1, 2], [2, 3]]), 1);
check('counts multiple disconnected districts', () => countDistricts(6, [[0, 1], [1, 2], [3, 4]]), 3);
check('isolated intersections each count', () => countDistricts(3, []), 3);
check('cycle still counts once', () => countDistricts(5, [[0, 1], [1, 2], [2, 0], [3, 4]]), 2);
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
