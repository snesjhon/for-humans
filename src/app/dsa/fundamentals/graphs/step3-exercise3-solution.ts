// Goal: Practice grouping zero-arrow intersections into parallel dispatch waves.
type Street = [number, number];

function dispatchWaves(n: number, streets: Street[]): number[][] {
  const ledger = Array.from({ length: n }, () => [] as number[]);
  const indegree = Array<number>(n).fill(0);

  for (const [from, to] of streets) {
    ledger[from].push(to);
    indegree[to]++;
  }

  let current = Array.from({ length: n }, (_, node) => node).filter(
    (node) => indegree[node] === 0,
  );
  const waves: number[][] = [];
  let processed = 0;

  while (current.length > 0) {
    waves.push([...current]);
    processed += current.length;

    const nextWave: number[] = [];
    for (const node of current) {
      for (const next of ledger[node]) {
        indegree[next]--;
        if (indegree[next] === 0) {
          nextWave.push(next);
        }
      }
    }

    current = nextWave;
  }

  return processed === n ? waves : [];
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
