// Goal: Use Binary Search over candidate eating speeds to find the minimum
//       speed that lets Koko finish all piles within h hours.

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
runCase('example 1: piles [3,6,7,11], h = 8', () => minEatingSpeed([3, 6, 7, 11], 8), 4);
runCase('example 2: piles [30,11,23,4,20], h = 5', () => minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
runCase('example 3: piles [30,11,23,4,20], h = 6', () => minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
runCase('single pile in one hour needs the full pile size', () => minEatingSpeed([312884470], 1), 312884470);
runCase('large pile mix can still return a small working speed', () => minEatingSpeed([25, 10, 23, 4], 7), 12);
runCase('uniform piles with generous time can use a lower speed', () => minEatingSpeed([9, 9, 9], 9), 3);
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
