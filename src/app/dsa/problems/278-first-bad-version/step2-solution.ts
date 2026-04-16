// Goal: Keep shrinking the version range until only the earliest bad version
//       remains certified as the answer.

type IsBadVersion = (version: number) => boolean;

function firstBadVersion(n: number, isBadVersion: IsBadVersion): number {
  let left = 1;
  let right = n;
  let answer = n;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (isBadVersion(mid)) {
      answer = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return answer;
}

// ---Tests
runCase('single version can already be bad', () => firstBadVersion(1, createIsBadVersion(1)), 1);
runCase('example 1: first bad version is 4', () => firstBadVersion(5, createIsBadVersion(4)), 4);
runCase('finds the earliest bad version after squeezing left', () =>
  firstBadVersion(8, createIsBadVersion(6)), 6);
runCase('finds the earliest bad version when it is the first version', () =>
  firstBadVersion(9, createIsBadVersion(1)), 1);
runCase('finds the earliest bad version when only the last version is bad', () =>
  firstBadVersion(9, createIsBadVersion(9)), 9);
// ---End Tests

// ---Helpers
function createIsBadVersion(firstBad: number): IsBadVersion {
  return (version: number) => version >= firstBad;
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
