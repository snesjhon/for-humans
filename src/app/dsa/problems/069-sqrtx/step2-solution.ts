// Goal: Keep shrinking the candidate side lengths until only the last safe
//       square remains, then return that side length.

function mySqrt(x: number): number {
  let left = 0;
  let right = x;
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (mid === 0 || mid <= x / mid) {
      answer = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return answer;
}

// ---Tests
runCase('zero tiles means side length zero', () => mySqrt(0), 0);
runCase('example 1: x = 4', () => mySqrt(4), 2);
runCase('example 2: x = 8 truncates to 2', () => mySqrt(8), 2);
runCase('x = 1 returns 1', () => mySqrt(1), 1);
runCase('x = 15 returns the last safe side length 3', () => mySqrt(15), 3);
runCase('handles a large input without overflow', () => mySqrt(2147395599), 46339);
// ---End Tests

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
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
