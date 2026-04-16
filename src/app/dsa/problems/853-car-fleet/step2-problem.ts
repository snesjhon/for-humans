// Goal: Zip positions with speeds, sort the cars by road position, and keep the
// trivial early return from step 1.

function carFleet(target: number, position: number[], speed: number[]): number {
  if (position.length <= 1) {
    return position.length;
  }

  throw new Error('not implemented');
}

// ---Tests
runCase('empty road has no fleets', () => carFleet(10, [], []), 0);
runCase('single car is one fleet', () => carFleet(10, [3], [3]), 1);
runCase('cars that never catch up still count separately', () => carFleet(12, [0, 4, 8], [1, 1, 1]), 3);
runCase('input order can be unsorted', () => carFleet(12, [8, 0, 4], [1, 1, 1]), 3);
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
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers
