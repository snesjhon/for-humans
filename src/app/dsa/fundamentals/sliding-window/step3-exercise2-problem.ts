// Goal: Practice fixed-size window with frequency map — find all anagram windows.
//
// The historian catalogs every window in a manuscript that uses the same
// characters (same frequencies) as a reference passage, just rearranged.
// The frame size is fixed to the length of the reference passage.
// Slide the fixed frame and compare character frequency maps at each position.
//
// Return the number of windows in s that are anagrams of pattern.
//
// Example:
//   countAnagramWindows("cbaebabacd", "abc") → 2  (windows "cba" at 0, "bac" at 6)
//   countAnagramWindows("af", "be")           → 0  (no matching window)
function countAnagramWindows(s: string, pattern: string): number {
  throw new Error('not implemented');
}

// ---Tests
test('two matches',             () => countAnagramWindows('cbaebabacd', 'abc'),   2);
test('no matches',              () => countAnagramWindows('af', 'be'),            0);
test('all windows match',       () => countAnagramWindows('aaa', 'a'),            3);
test('pattern longer than s',   () => countAnagramWindows('ab', 'abc'),           0);
test('single match at start',   () => countAnagramWindows('bac', 'abc'),          1);
test('repeated chars in pattern', () => countAnagramWindows('aabab', 'aab'),      2);
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
