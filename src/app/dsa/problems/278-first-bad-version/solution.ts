// Goal: Use Binary Search over the monotone version API to find the first bad
//       version in O(log n) calls.

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
runCase('example 1: first bad version is 4', () => firstBadVersion(5, createIsBadVersion(4)), 4);
runCase('example 2: single bad version', () => firstBadVersion(1, createIsBadVersion(1)), 1);
runCase('finds the earliest bad version in the middle', () =>
  firstBadVersion(10, createIsBadVersion(6)), 6);
runCase('handles the first version being bad', () => firstBadVersion(9, createIsBadVersion(1)), 1);
runCase('handles only the last version being bad', () => firstBadVersion(9, createIsBadVersion(9)), 9);
runCase('handles a large boundary near the end', () =>
  firstBadVersion(100, createIsBadVersion(97)), 97);
// ---End Tests

// ---Helpers
function createIsBadVersion(firstBad: number): IsBadVersion {
  return (version: number) => version >= firstBad;
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
