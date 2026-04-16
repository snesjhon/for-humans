// =============================================================================
// Binary Search — Level 3, Exercise 3: Calibrate the Smallest Reading Rate — SOLUTION
// =============================================================================
// Goal: Keep the smallest rate whose pass/fail test finishes the reading plan on time.
// =============================================================================
function minimumReadingRate(chapters: number[], hours: number): number {
  let left = 1;
  let right = Math.max(...chapters);
  let answer = right;

  const canFinish = (rate: number): boolean => {
    let spent = 0;
    for (const pages of chapters) {
      spent += Math.ceil(pages / rate);
    }
    return spent <= hours;
  };

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canFinish(mid)) {
      answer = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return answer;
}

test('sample reading plan', () => minimumReadingRate([30, 11, 23, 4, 20], 6), 23);
test('exactly enough time at max chapter', () => minimumReadingRate([12, 8, 6], 5), 6);
test('one chapter per hour', () => minimumReadingRate([5, 9, 7], 3), 9);
test('more time allows slower rate', () => minimumReadingRate([5, 9, 7], 6), 5);
test('single chapter', () => minimumReadingRate([15], 4), 4);
test('uniform chapters', () => minimumReadingRate([8, 8, 8, 8], 8), 4);

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
