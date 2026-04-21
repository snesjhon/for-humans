// Goal: Use Binary Search over eating speeds to return the minimum speed that
//       clears every pile within h hours.

function minEatingSpeed(piles: number[], h: number): number {
  let left = 1;
  let right = Math.max(...piles);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (canFinishAtSpeed(piles, h, mid)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

// ---Tests
runCase('step 1 midpoint case still passes', () => minEatingSpeed([8, 8, 8, 8], 8), 4);
runCase('example 1: four piles in eight hours', () => minEatingSpeed([3, 6, 7, 11], 8), 4);
runCase('handles a high answer at the right edge', () => minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
runCase('handles a mixed answer in the middle', () => minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
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
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
