// Goal: Start the function by creating the answer sheet with one slot per day,
// all preset to `0` in case no warmer future day is ever found.

function dailyTemperatures(temperatures: number[]): number[] {
  const waitDays = new Array<number>(temperatures.length).fill(0);
  return waitDays;
}

// ---Tests
runCase('single day has no warmer future day', () => dailyTemperatures([55]), [0]);
runCase('strictly cooling week stays all zeroes', () => dailyTemperatures([80, 75, 70]), [0, 0, 0]);
runCase('equal temperatures are still no warmer day', () => dailyTemperatures([70, 70]), [0, 0]);
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
