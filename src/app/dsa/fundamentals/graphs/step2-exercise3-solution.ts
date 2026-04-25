// Goal: Practice writing one district report for every new sweep the outer scan launches.
type Road = [number, number];

function districtSizeReport(n: number, roads: Road[]): number[] {
  const ledger = Array.from({ length: n }, () => [] as number[]);
  for (const [a, b] of roads) {
    ledger[a].push(b);
    ledger[b].push(a);
  }

  const visited = Array<boolean>(n).fill(false);
  const sizes: number[] = [];

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

    sizes.push(size);
  }

  return sizes.sort((a, b) => a - b);
}

// ---Tests
check('empty city produces empty report', () => districtSizeReport(0, []), []);
check('isolated intersections each report size one', () => districtSizeReport(3, []), [1, 1, 1]);
check('mixed city reports all district sizes', () => districtSizeReport(6, [[0, 1], [1, 2], [3, 4]]), [1, 2, 3]);
check('single district reports one size', () => districtSizeReport(4, [[0, 1], [1, 2], [2, 3]]), [4]);
check('cycle and isolated node combine correctly', () => districtSizeReport(5, [[0, 1], [1, 2], [2, 0]]), [1, 1, 3]);
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
