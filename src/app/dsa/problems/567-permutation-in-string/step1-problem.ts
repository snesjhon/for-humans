// Goal: Build targetBag from s1 and windowBag from the first len(s1) chars of s2,
//       count the initial matches across all 26 slots, and return true if matches === 26.

function checkInclusion(s1: string, s2: string): boolean {
  throw new Error('not implemented');
}

// ---Tests
test('s1 longer than s2 — no tray position possible', () => checkInclusion('abc', ''), false);
test('s1 longer than s2 by one', () => checkInclusion('abc', 'ab'), false);
test('initial window is exact match — same order', () => checkInclusion('ab', 'ab'), true);
test('initial window is exact match — reversed', () => checkInclusion('ab', 'ba'), true);
test('single char match at start', () => checkInclusion('a', 'a'), true);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
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
    } else { throw e; }
  }
}
