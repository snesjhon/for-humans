// =============================================================================
// Hash Maps & Sets — Level 2, Exercise 2: Cross-Check Two Logbooks — SOLUTION
// =============================================================================
// Goal: Use a logbook (hash set) to find which entries appear in BOTH arrays
//       without nested scanning.
function intersection(a: number[], b: number[]): number[] {
  const setA = new Set(a);
  const result = new Set(b.filter((x) => setA.has(x)));
  return [...result].sort((x, y) => x - y);
}

test('basic', () => intersection([1, 2, 3], [2, 3, 4]), [2, 3]);
test('duplicates deduped', () => intersection([1, 1, 2], [1, 1]), [1]);
test('no overlap', () => intersection([1, 2, 3], [4, 5, 6]), []);
test('empty a', () => intersection([], [1, 2]), []);
test('empty b', () => intersection([1, 2], []), []);
test('subset', () => intersection([1, 2, 3, 4], [2, 4]), [2, 4]);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function test(desc: string, fn: () => unknown, expected: unknown): void {
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
