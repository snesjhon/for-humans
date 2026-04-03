// Goal: Add the future-candidate stack and the right-to-left traversal so each
// day joins the line after it has been inspected.

function dailyTemperatures(temperatures: number[]): number[] {
  const waitDays = new Array<number>(temperatures.length).fill(0);
  const futureLine: number[] = [];

  for (let day = temperatures.length - 1; day >= 0; day--) {
    futureLine.push(day); // every inspected day becomes part of the future for earlier days
  }

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
