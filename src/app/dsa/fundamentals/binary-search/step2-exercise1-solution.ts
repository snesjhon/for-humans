// =============================================================================
// Binary Search — Level 2, Exercise 1: Find the First Passing Mark — SOLUTION
// =============================================================================
// Goal: Squeeze toward the first rail mark that is not less than the target.
// =============================================================================
function firstNotLessThan(marks: number[], target: number): number {
  let left = 0;
  let right = marks.length - 1;
  let answer = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (marks[mid] >= target) {
      answer = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return answer;
}

test('first passing mark with duplicates', () => firstNotLessThan([10, 14, 19, 30, 30, 42], 30), 3);
test('first passing mark after gap', () => firstNotLessThan([10, 14, 19, 30, 30, 42], 31), 5);
test('target below all marks', () => firstNotLessThan([10, 14, 19], 1), 0);
test('target above all marks', () => firstNotLessThan([10, 14, 19], 25), -1);
test('single passing mark', () => firstNotLessThan([7], 7), 0);
test('empty rail', () => firstNotLessThan([], 7), -1);

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
