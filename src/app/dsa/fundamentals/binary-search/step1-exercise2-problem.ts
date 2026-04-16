// =============================================================================
// Binary Search — Level 1, Exercise 2: Confirm the Rail Mark Exists
// =============================================================================
// Goal: Practice exact-hit search when the answer is yes/no instead of an index.
//
// The surveyor only needs to know whether a calibration mark exists on the rail.
// Return true if target is present, otherwise false.
//
// Example:
//   hasCalibrationMark([3, 7, 11, 18, 25], 11) → true
//   hasCalibrationMark([3, 7, 11, 18, 25], 12) → false
// =============================================================================
function hasCalibrationMark(marks: number[], target: number): boolean {
  throw new Error('not implemented');
}

test('mark exists in middle', () => hasCalibrationMark([3, 7, 11, 18, 25], 11), true);
test('mark exists at left edge', () => hasCalibrationMark([3, 7, 11, 18, 25], 3), true);
test('mark exists at right edge', () => hasCalibrationMark([3, 7, 11, 18, 25], 25), true);
test('missing mark between values', () => hasCalibrationMark([3, 7, 11, 18, 25], 12), false);
test('single missing mark', () => hasCalibrationMark([9], 2), false);
test('empty rail', () => hasCalibrationMark([], 2), false);

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
