// Goal: Use Binary Search to find the largest integer whose square is still at
//       most x, then return that truncated square root in O(log x) time.

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
runCase('example 1: x = 4', () => mySqrt(4), 2);
runCase('example 2: x = 8 truncates to 2', () => mySqrt(8), 2);
runCase('zero stays zero', () => mySqrt(0), 0);
runCase('one stays one', () => mySqrt(1), 1);
runCase('perfect squares return their side length', () => mySqrt(81), 9);
runCase('non-perfect squares truncate down', () => mySqrt(26), 5);
runCase('large input avoids overflow', () => mySqrt(2147395599), 46339);
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
