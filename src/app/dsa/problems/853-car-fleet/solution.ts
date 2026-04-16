// Goal: Sort cars by road position, then scan from closest to farthest while a
// monotonic stack of arrival times tracks the surviving fleet frontiers.

function carFleet(target: number, position: number[], speed: number[]): number {
  if (position.length <= 1) {
    return position.length;
  }

  const cars = position
    .map((carPosition, index) => ({ position: carPosition, speed: speed[index] }))
    .sort((a, b) => a.position - b.position);
  const fleetArrivalTimes: number[] = [];

  for (let index = cars.length - 1; index >= 0; index--) {
    const arrivalTime = (target - cars[index].position) / cars[index].speed;

    if (
      fleetArrivalTimes.length === 0 ||
      arrivalTime > fleetArrivalTimes[fleetArrivalTimes.length - 1]
    ) {
      fleetArrivalTimes.push(arrivalTime);
    }
  }

  return fleetArrivalTimes.length;
}

// ---Tests
runCase('example 1', () => carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]), 3);
runCase('example 2', () => carFleet(10, [3], [3]), 1);
runCase('example 3', () => carFleet(100, [0, 2, 4], [4, 2, 1]), 1);
runCase('meeting exactly at the destination still merges', () => carFleet(10, [8, 6], [2, 4]), 1);
runCase('cars with later arrival times stay separate', () => carFleet(12, [0, 4, 8], [1, 1, 1]), 3);
runCase('unsorted input still respects road order after sorting', () => carFleet(12, [8, 0, 4], [1, 1, 1]), 3);
runCase('rear cars can merge while a farther front car stays separate', () => carFleet(15, [10, 0, 5], [1, 4, 1]), 2);
// ---End Tests

// ---Helpers
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
