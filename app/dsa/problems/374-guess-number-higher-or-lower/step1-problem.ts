// Goal: Set the hallway boundaries, probe the midpoint once, and return the
//       midpoint only when the first guide response is an exact match.

type GuessApi = (num: number) => -1 | 0 | 1;

function guessNumber(n: number, guess: GuessApi): number {
  throw new Error('not implemented');
}

// ---Tests
runCase('single door can match immediately', () => guessNumber(1, createGuessApi(1)), 1);
runCase('odd hallway can hit the first midpoint exactly', () => guessNumber(7, createGuessApi(4)), 4);
runCase('first midpoint can miss high, so Step 1 returns -1 for now', () =>
  guessNumber(10, createGuessApi(3)), -1);
runCase('first midpoint can miss low, so Step 1 returns -1 for now', () =>
  guessNumber(10, createGuessApi(8)), -1);
// ---End Tests

// ---Helpers
function createGuessApi(pick: number): GuessApi {
  return (num: number) => {
    if (num === pick) return 0;
    return num < pick ? 1 : -1;
  };
}

function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw e;
    }
  }
}
// ---End Helpers
