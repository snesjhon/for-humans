// Goal: Search the candidate side lengths, probe the midpoint, and return the
//       first midpoint only when that square already fits inside x.

function mySqrt(x: number): number {
  throw new Error('not implemented');
}

// ---Tests
runCase('zero tiles means side length zero', () => mySqrt(0), 0);
runCase('x = 2 certifies side length 1 on the first probe', () => mySqrt(2), 1);
runCase('x = 3 certifies side length 1 on the first probe', () => mySqrt(3), 1);
runCase('x = 4 certifies side length 2 on the first probe', () => mySqrt(4), 2);
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
