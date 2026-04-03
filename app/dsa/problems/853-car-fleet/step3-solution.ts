// Goal: Add the reverse road scan and compute each car's solo arrival time into
// a fleet stack, without merging fleets yet.

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
    fleetArrivalTimes.push(arrivalTime);
  }

  return fleetArrivalTimes.length;
}

// ---Tests
runCase('empty road has no fleets', () => carFleet(10, [], []), 0);
runCase('single car is one fleet', () => carFleet(10, [3], [3]), 1);
runCase('cars that never catch up still count separately', () => carFleet(12, [0, 4, 8], [1, 1, 1]), 3);
runCase('reverse scan works on unsorted input too', () => carFleet(12, [8, 0, 4], [1, 1, 1]), 3);
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
