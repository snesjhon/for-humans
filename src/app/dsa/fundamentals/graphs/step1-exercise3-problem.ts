// Goal: Practice deciding whether a destination lives inside the same stamped district.
//
// Return true if target is reachable from start using two-way roads.
//
// Example:
//   canReachIntersection(5, [[0,1],[1,2],[3,4]], 0, 2) → true
//   canReachIntersection(5, [[0,1],[1,2],[3,4]], 0, 4) → false
type Road = [number, number];

function canReachIntersection(
  n: number,
  roads: Road[],
  start: number,
  target: number,
): boolean {
  throw new Error('not implemented');
}

// ---Tests
check('start already equals target', () => canReachIntersection(3, [[0, 1]], 2, 2), true);
check('finds reachable target in same district', () => canReachIntersection(5, [[0, 1], [1, 2], [3, 4]], 0, 2), true);
check('returns false across disconnected districts', () => canReachIntersection(5, [[0, 1], [1, 2], [3, 4]], 0, 4), false);
check('handles cycles safely', () => canReachIntersection(4, [[0, 1], [1, 2], [2, 0]], 0, 2), true);
check('isolated target stays unreachable', () => canReachIntersection(4, [[0, 1]], 0, 3), false);
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
