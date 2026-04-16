// Goal: Keep a monotonic stack of future day indices so the top always points
// to the nearest remaining warmer day after cleanup.

function dailyTemperatures(temperatures: number[]): number[] {
  const waitDays = new Array<number>(temperatures.length).fill(0);
  const futureLine: number[] = [];

  for (let day = temperatures.length - 1; day >= 0; day--) {
    while (
      futureLine.length > 0 &&
      temperatures[futureLine[futureLine.length - 1]] <= temperatures[day]
    ) {
      futureLine.pop(); // cooler or equal future days are blocked by the current day
    }

    if (futureLine.length > 0) {
      waitDays[day] = futureLine[futureLine.length - 1] - day; // the surviving top is the first warmer day
    }

    futureLine.push(day); // current day becomes part of the future for earlier positions
  }

  return waitDays;
}

// ---Tests
runCase('example 1', () => dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
runCase('example 2', () => dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0]);
runCase('example 3', () => dailyTemperatures([30, 60, 90]), [1, 1, 0]);
runCase('strictly cooling days all stay zero', () => dailyTemperatures([80, 75, 70]), [0, 0, 0]);
runCase('equal temperatures are not warm enough', () => dailyTemperatures([70, 70, 71]), [2, 1, 0]);
runCase('later hotter day can skip over several blocked days', () => dailyTemperatures([71, 69, 68, 72]), [3, 2, 1, 0]);
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
