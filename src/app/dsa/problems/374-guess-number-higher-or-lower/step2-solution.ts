// Goal: Follow the higher-or-lower guide signal to keep shrinking the hallway
//       until the midpoint lands on the hidden number.

type GuessApi = (num: number) => -1 | 0 | 1;

function guessNumber(n: number, guess: GuessApi): number {
  let left = 1;
  let right = n;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const response = guess(mid);

    if (response === 0) {
      return mid;
    }

    if (response === 1) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// ---Tests
runCase('example 1: pick 6 inside hallway 1..10', () => guessNumber(10, createGuessApi(6)), 6);
runCase('example 2: single door match', () => guessNumber(1, createGuessApi(1)), 1);
runCase('example 3: two-door hallway can find the first door', () => guessNumber(2, createGuessApi(1)), 1);
runCase('finds a number after moving the left boundary rightward', () =>
  guessNumber(20, createGuessApi(17)), 17);
runCase('finds a number after moving the right boundary leftward', () =>
  guessNumber(20, createGuessApi(3)), 3);
// ---End Tests

// ---Helpers
function createGuessApi(pick: number): GuessApi {
  return (num: number) => {
    if (num === pick) return 0;
    return num < pick ? 1 : -1;
  };
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
