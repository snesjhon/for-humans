// Goal: Keep the exact-mark probe working when the surveyor's rail crosses from negative to positive.
//
// The surveyor's ledger is still sorted, but it includes negative and positive marks.
// Return the index of `target`, or `-1` if the mark is absent.
function findLedgerMark(marks: number[], target: number): number {
  let left = 0;
  let right = marks.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (marks[mid] === target) return mid;
    if (marks[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// ---Tests
test('negative mark present', () => findLedgerMark([-12, -3, 0, 4, 9, 18], -3), 1);
test('zero mark present', () => findLedgerMark([-12, -3, 0, 4, 9, 18], 0), 2);
test('positive mark present', () => findLedgerMark([-12, -3, 0, 4, 9, 18], 18), 5);
test('mark missing between negatives', () => findLedgerMark([-12, -3, 0, 4, 9, 18], -5), -1);
test('mark missing above all values', () => findLedgerMark([-12, -3, 0, 4, 9, 18], 30), -1);
test('single negative mark', () => findLedgerMark([-7], -7), 0);
// ---End Tests

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
