// Goal: Set the Binary Search boundaries over versions 1..n, certify the
//       first bad midpoint as a candidate answer, and return that candidate
//       immediately when the first probe is already bad.

type IsBadVersion = (version: number) => boolean;

function firstBadVersion(n: number, isBadVersion: IsBadVersion): number {
  throw new Error('not implemented');
}

// ---Tests
runCase('single version can already be bad', () => firstBadVersion(1, createIsBadVersion(1)), 1);
runCase('first midpoint can certify the first bad version immediately', () =>
  firstBadVersion(7, createIsBadVersion(4)), 4);
runCase('first midpoint can still be good, so Step 1 falls back to n for now', () =>
  firstBadVersion(5, createIsBadVersion(5)), 5);
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
