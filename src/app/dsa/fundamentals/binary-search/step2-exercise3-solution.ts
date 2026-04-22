// Goal: Search the surveyor's pass-fail rail and find where the first green light begins.
//
// The rail is monotone: all `false` marks come first, then all `true` marks.
// Return the first index holding `true`, or `-1` if none do.
function firstPassingMark(results: boolean[]): number {
  let left = 0;
  let right = results.length - 1;
  let answer = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (results[mid]) {
      answer = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return answer;
}

// ---Tests
test('green starts in middle', () => firstPassingMark([false, false, true, true]), 2);
test('green starts at beginning', () => firstPassingMark([true, true, true]), 0);
test('no green mark', () => firstPassingMark([false, false, false]), -1);
test('single green mark', () => firstPassingMark([true]), 0);
test('single red mark', () => firstPassingMark([false]), -1);
test('late green start', () => firstPassingMark([false, false, false, false, true]), 4);
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
