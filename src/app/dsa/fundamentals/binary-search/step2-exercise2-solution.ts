// =============================================================================
// Binary Search — Level 2, Exercise 2: Find the Last Safe Mark — SOLUTION
// =============================================================================
// Goal: Squeeze toward the last rail mark that is not greater than the target.
// =============================================================================
function lastNotGreaterThan(marks: number[], target: number): number {
  let left = 0;
  let right = marks.length - 1;
  let answer = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (marks[mid] <= target) {
      answer = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return answer;
}

test('last safe mark with duplicates', () => lastNotGreaterThan([5, 9, 9, 12, 20], 9), 2);
test('last safe mark before gap', () => lastNotGreaterThan([5, 9, 9, 12, 20], 11), 2);
test('target below all marks', () => lastNotGreaterThan([5, 9, 9, 12, 20], 1), -1);
test('target above all marks', () => lastNotGreaterThan([5, 9, 9, 12, 20], 25), 4);
test('single safe mark', () => lastNotGreaterThan([7], 7), 0);
test('empty rail', () => lastNotGreaterThan([], 7), -1);

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
