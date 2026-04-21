// Goal: Probe the midpoint eating speed and return it only when that speed
//       works and the next slower speed fails.

function minEatingSpeed(piles: number[], h: number): number {
  throw new Error('not implemented');
}

// ---Tests
runCase('single pile with one hour needs speed 1', () => minEatingSpeed([1], 1), 1);
runCase('the first midpoint can already be the answer', () => minEatingSpeed([8, 8, 8, 8], 8), 4);
runCase('another direct certification at the midpoint', () => minEatingSpeed([10, 10, 10, 10], 8), 5);
runCase('mixed piles can still certify the first midpoint', () => minEatingSpeed([4, 4, 4, 4], 8), 2);
// ---End Tests

// ---Helpers
function canFinishAtSpeed(piles: number[], h: number, speed: number): boolean {
  let hoursNeeded = 0;

  for (const pile of piles) {
    hoursNeeded += Math.ceil(pile / speed);
  }

  return hoursNeeded <= h;
}

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
