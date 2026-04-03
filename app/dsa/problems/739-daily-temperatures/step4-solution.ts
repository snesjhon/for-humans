// Goal: Remove blocked future days first so the stack top becomes the nearest
// true warmer day, not just the nearest future day.

function dailyTemperatures(temperatures: number[]): number[] {
  const waitDays = new Array<number>(temperatures.length).fill(0);
  const futureLine: number[] = [];

  for (let day = temperatures.length - 1; day >= 0; day--) {
    while (
      futureLine.length > 0 &&
      temperatures[futureLine[futureLine.length - 1]] <= temperatures[day]
    ) {
      futureLine.pop(); // blocked candidates cannot answer for this day or any earlier one
    }

    if (
      futureLine.length > 0 &&
      temperatures[futureLine[futureLine.length - 1]] > temperatures[day]
    ) {
      waitDays[day] = futureLine[futureLine.length - 1] - day; // top is now the nearest warmer day
    }

    futureLine.push(day); // current day joins the line for earlier days
  }

  return waitDays;
}

// ---Tests
runCase(
  'prompt example sequence',
  () => dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]),
  [1, 1, 4, 2, 1, 1, 0, 0],
);
runCase('strictly warmer streak waits one day each time', () => dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0]);
runCase('equal temperature must be skipped to find a true warmer day', () => dailyTemperatures([70, 70, 71]), [2, 1, 0]);
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
