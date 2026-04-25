// Goal: Practice spotting a one-way traffic loop by dispatching only intersections with zero incoming arrows.
type Street = [number, number];

function oneWayLoopExists(n: number, streets: Street[]): boolean {
  const ledger = Array.from({ length: n }, () => [] as number[]);
  const indegree = Array<number>(n).fill(0);

  for (const [from, to] of streets) {
    ledger[from].push(to);
    indegree[to]++;
  }

  const queue: number[] = [];
  for (let node = 0; node < n; node++) {
    if (indegree[node] === 0) queue.push(node);
  }

  let head = 0;
  let processed = 0;

  while (head < queue.length) {
    const node = queue[head++];
    processed++;

    for (const next of ledger[node]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  return processed !== n;
}

// ---Tests
check('empty city has no loop', () => oneWayLoopExists(0, []), false);
check('simple chain has no loop', () => oneWayLoopExists(3, [[0, 1], [1, 2]]), false);
check('triangle loop is detected', () => oneWayLoopExists(3, [[0, 1], [1, 2], [2, 0]]), true);
check('self-loop counts as cycle', () => oneWayLoopExists(2, [[1, 1]]), true);
check('disconnected graph can still contain a loop', () => oneWayLoopExists(5, [[0, 1], [2, 3], [3, 4], [4, 2]]), true);
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
