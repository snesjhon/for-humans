// Goal: Practice deciding whether a destination lives inside the same stamped district.
type Road = [number, number];

function canReachIntersection(
  n: number,
  roads: Road[],
  start: number,
  target: number,
): boolean {
  const ledger = Array.from({ length: n }, () => [] as number[]);
  for (const [a, b] of roads) {
    ledger[a].push(b);
    ledger[b].push(a);
  }

  const stack = [start];
  const visited = Array<boolean>(n).fill(false);
  visited[start] = true;

  while (stack.length > 0) {
    const node = stack.pop() as number;
    if (node === target) return true;

    for (const next of ledger[node]) {
      if (visited[next]) continue;
      visited[next] = true;
      stack.push(next);
    }
  }

  return false;
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
