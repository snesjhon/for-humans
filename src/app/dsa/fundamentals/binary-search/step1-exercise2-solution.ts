// Goal: Practice exact-hit search when the surveyor only needs to confirm a rail mark exists.
//
// The surveyor checks a sorted rail of calibration marks.
// Return `true` if `target` is present, otherwise return `false`.
function hasCalibrationMark(marks: number[], target: number): boolean {
  let left = 0;
  let right = marks.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (marks[mid] === target) return true;
    if (marks[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return false;
}

// ---Tests
test('mark exists in middle', () => hasCalibrationMark([3, 7, 11, 18, 25], 11), true);
test('mark exists at left edge', () => hasCalibrationMark([3, 7, 11, 18, 25], 3), true);
test('mark exists at right edge', () => hasCalibrationMark([3, 7, 11, 18, 25], 25), true);
test('mark missing between values', () => hasCalibrationMark([3, 7, 11, 18, 25], 12), false);
test('single mark missing', () => hasCalibrationMark([8], 3), false);
test('empty rail', () => hasCalibrationMark([], 8), false);
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
