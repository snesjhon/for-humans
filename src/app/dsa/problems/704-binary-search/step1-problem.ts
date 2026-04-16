// Goal: Set the left and right clamps, probe the midpoint, and return the
//       midpoint index only when the first probe is an exact hit.

function search(nums: number[], target: number): number {
  throw new Error('not implemented');
}

// ---Tests
runCase('empty rail has no target', () => search([], 4), -1);
runCase('single mark matches immediately', () => search([7], 7), 0);
runCase('single mark can miss immediately', () => search([7], 3), -1);
runCase('odd-length rail can hit the first midpoint exactly', () => search([-1, 0, 3, 5, 9], 3), 2);
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
