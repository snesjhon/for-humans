// =============================================================================
// Binary Search — Level 1, Exercise 3: Probe a Mixed Ledger
// =============================================================================
// Goal: Keep the exact-hit search working even when the rail includes negatives.
//
// The surveyor's ledger is still sorted, but it crosses from negative to positive.
// Return the index of target, or -1 if the mark is absent.
//
// Example:
//   findLedgerMark([-12, -3, 0, 4, 9, 18], -3) → 1
//   findLedgerMark([-12, -3, 0, 4, 9, 18], 5)  → -1
// =============================================================================
function findLedgerMark(marks: number[], target: number): number {
  throw new Error('not implemented');
}

test('negative mark present', () => findLedgerMark([-12, -3, 0, 4, 9, 18], -3), 1);
test('zero mark present', () => findLedgerMark([-12, -3, 0, 4, 9, 18], 0), 2);
test('positive mark present', () => findLedgerMark([-12, -3, 0, 4, 9, 18], 18), 5);
test('missing negative mark', () => findLedgerMark([-12, -3, 0, 4, 9, 18], -7), -1);
test('missing positive mark', () => findLedgerMark([-12, -3, 0, 4, 9, 18], 5), -1);
test('single negative rail', () => findLedgerMark([-4], -4), 0);

// ---Helpers
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
// ---End Helpers
