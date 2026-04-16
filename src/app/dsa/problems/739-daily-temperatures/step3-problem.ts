// Goal: If the nearest future day on top is already warmer, record the day gap
// before pushing the current day into the line.

function dailyTemperatures(temperatures: number[]): number[] {
  const waitDays = new Array<number>(temperatures.length).fill(0);
  const futureLine: number[] = [];

  for (let day = temperatures.length - 1; day >= 0; day--) {
    throw new Error('not implemented');
    futureLine.push(day); // Step 2: each day joins the future line after inspection
  }

  return waitDays;
}

// ---Tests
runCase('single day still has no warmer future day', () => dailyTemperatures([55]), [0]);
runCase('strictly cooling week stays all zeroes', () => dailyTemperatures([80, 75, 70]), [0, 0, 0]);
runCase('strictly warmer streak waits one day each time', () => dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0]);
runCase('every day can use the immediate next hotter day', () => dailyTemperatures([30, 60, 90]), [1, 1, 0]);
// ---End Tests

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers
