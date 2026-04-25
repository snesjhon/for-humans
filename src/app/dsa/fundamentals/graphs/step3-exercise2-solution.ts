// Goal: Practice writing one legal dispatch order through a one-way city.
type Street = [number, number];

function deliveryOrder(n: number, streets: Street[]): number[] {
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

  const order: number[] = [];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);

    for (const next of ledger[node]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  return order.length === n ? order : [];
}

// ---Tests
check('empty city has empty order', () => deliveryOrder(0, []), []);
check('simple dependency chain keeps order', () => deliveryOrder(3, [[0, 1], [1, 2]]), [0, 1, 2]);
check('branching dependency returns valid order', () => deliveryOrder(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), [0, 1, 2, 3]);
check('multiple zero-indegree starts still work', () => deliveryOrder(4, [[1, 3], [2, 3]]), [0, 1, 2, 3]);
check('cycle returns empty order', () => deliveryOrder(2, [[0, 1], [1, 0]]), []);
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
