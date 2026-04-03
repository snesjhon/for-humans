// Goal: Handle the trivial roads first. No cars means no fleets, and one car
// means exactly one fleet.

function carFleet(target: number, position: number[], speed: number[]): number {
  if (position.length <= 1) {
    return position.length;
  }

  throw new Error('next step');
}

// ---Tests
runCase('empty road has no fleets', () => carFleet(10, [], []), 0);
runCase('single car is one fleet', () => carFleet(10, [3], [3]), 1);
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
    if (error instanceof Error && error.message === 'next step') {
      // Ignore non-step-1 cases in the step solution.
    } else {
      throw error;
    }
  }
}
// ---End Helpers
