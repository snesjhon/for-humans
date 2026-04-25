// Goal: Practice measuring the biggest district after the city is split into components.
type Road = [number, number];

function largestDistrictSize(n: number, roads: Road[]): number {
  if (n === 0) return 0;

  const ledger = Array.from({ length: n }, () => [] as number[]);
  for (const [a, b] of roads) {
    ledger[a].push(b);
    ledger[b].push(a);
  }

  const visited = Array<boolean>(n).fill(false);
  let best = 0;

  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    visited[start] = true;
    const stack = [start];
    let size = 0;

    while (stack.length > 0) {
      const node = stack.pop() as number;
      size++;

      for (const next of ledger[node]) {
        if (visited[next]) continue;
        visited[next] = true;
        stack.push(next);
      }
    }

    best = Math.max(best, size);
  }

  return best;
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
