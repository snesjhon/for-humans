// Goal: Practice drawing the city ledger so every two-way road appears from both intersections.
type Road = [number, number];

function buildStreetLedger(n: number, roads: Road[]): number[][] {
  const ledger = Array.from({ length: n }, () => [] as number[]);

  for (const [a, b] of roads) {
    ledger[a].push(b);
    ledger[b].push(a);
  }

  return ledger;
}

// ---Tests
check('empty city keeps empty ledgers', () => buildStreetLedger(3, []), [[], [], []]);
check('single road is written both ways', () => buildStreetLedger(2, [[0, 1]]), [[1], [0]]);
check('multiple roads build full neighbor lists', () => buildStreetLedger(4, [[0, 1], [0, 2], [2, 3]]), [[1, 2], [0], [0, 3], [2]]);
check('intersection can have many streets', () => buildStreetLedger(5, [[1, 0], [1, 2], [1, 3], [1, 4]]), [[1], [0, 2, 3, 4], [1], [1], [1]]);
check('duplicate roads stay visible in insertion order', () => buildStreetLedger(3, [[0, 1], [1, 0], [1, 2]]), [[1, 1], [0, 0, 2], [1]]);
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
