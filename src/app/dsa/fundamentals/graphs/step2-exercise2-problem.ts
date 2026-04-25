// Goal: Practice measuring the biggest district after the city is split into components.
//
// Return the size of the largest connected component in an undirected graph.
//
// Example:
//   largestDistrictSize(7, [[0,1],[1,2],[3,4],[4,5]]) → 3
//   largestDistrictSize(4, [])                         → 1
type Road = [number, number];

function largestDistrictSize(n: number, roads: Road[]): number {
  throw new Error('not implemented');
}

// ---Tests
check('empty city has size 0', () => largestDistrictSize(0, []), 0);
check('isolated intersections have max size 1', () => largestDistrictSize(4, []), 1);
check('finds largest of several districts', () => largestDistrictSize(7, [[0, 1], [1, 2], [3, 4], [4, 5]]), 3);
check('single component uses all intersections', () => largestDistrictSize(5, [[0, 1], [1, 2], [2, 3], [3, 4]]), 5);
check('cycle size counts each intersection once', () => largestDistrictSize(6, [[0, 1], [1, 2], [2, 0], [3, 4]]), 3);
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
