// Goal: Use Binary Search with the tri-state guess API to find the hidden
//       number in O(log n) guesses.

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
runCase('example 1: n = 10, pick = 6', () => guessNumber(10, createGuessApi(6)), 6);
runCase('example 2: n = 1, pick = 1', () => guessNumber(1, createGuessApi(1)), 1);
runCase('example 3: n = 2, pick = 1', () => guessNumber(2, createGuessApi(1)), 1);
runCase('finds the largest possible pick', () => guessNumber(100, createGuessApi(100)), 100);
runCase('finds the smallest possible pick in a larger hallway', () => guessNumber(100, createGuessApi(1)), 1);
runCase('finds a middle pick after both left and right eliminations', () =>
  guessNumber(31, createGuessApi(14)), 14);
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
