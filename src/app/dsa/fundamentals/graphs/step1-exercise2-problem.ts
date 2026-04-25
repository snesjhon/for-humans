// Goal: Practice sweeping one district from a starting intersection.
//
// Return all intersections reachable from start in ascending order.
// The city roads are two-way.
//
// Example:
//   reachableDistrict(5, [[0,1],[1,2],[3,4]], 0) → [0,1,2]
//   reachableDistrict(5, [[0,1],[1,2],[3,4]], 3) → [3,4]
type Road = [number, number];

function reachableDistrict(n: number, roads: Road[], start: number): number[] {
  throw new Error('not implemented');
}

// ---Tests
check('start intersection is included', () => reachableDistrict(1, [], 0), [0]);
check('sweeps one connected district', () => reachableDistrict(5, [[0, 1], [1, 2], [3, 4]], 0), [0, 1, 2]);
check('ignores disconnected district', () => reachableDistrict(5, [[0, 1], [1, 2], [3, 4]], 3), [3, 4]);
check('cycle does not duplicate intersections', () => reachableDistrict(4, [[0, 1], [1, 2], [2, 0], [2, 3]], 0), [0, 1, 2, 3]);
check('isolated start returns only itself', () => reachableDistrict(4, [[0, 1]], 3), [3]);
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
