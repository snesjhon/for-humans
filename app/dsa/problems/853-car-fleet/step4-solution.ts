// Goal: Compare each car's arrival time to the convoy ahead so only cars that
// arrive later create a new fleet frontier.

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
runCase('empty road has no fleets', () => carFleet(10, [], []), 0);
runCase('single car is one fleet', () => carFleet(10, [3], [3]), 1);
runCase('example 1', () => carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]), 3);
runCase('meeting exactly at the destination still merges', () => carFleet(10, [8, 6], [2, 4]), 1);
runCase('all cars can collapse into one fleet', () => carFleet(100, [0, 2, 4], [4, 2, 1]), 1);
runCase('separated arrival times stay as distinct fleets', () => carFleet(12, [0, 4, 8], [1, 1, 1]), 3);
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
