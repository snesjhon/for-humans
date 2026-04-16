// Goal: Practice variable window with a frequency map — map size as the constraint.
//
// The historian is studying passages that use a limited vocabulary.
// She wants the longest passage that uses at most k distinct characters.
// Track which characters are inside the frame with a map, and shrink
// whenever the map grows beyond k distinct entries.
//
// Return the length of the longest substring with at most k distinct characters.
// If k === 0 or s is empty, return 0.
//
// Example:
//   longestKDistinct("eceba", 2) → 3  (substring "ece" has 2 distinct chars)
//   longestKDistinct("aabbcc", 1) → 2  (longest run of one char is "aa" or "bb" or "cc")
function longestKDistinct(s: string, k: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('two distinct allowed',      () => longestKDistinct('eceba', 2),        3);
test('one distinct allowed',      () => longestKDistinct('aabbcc', 1),       2);
test('entire string qualifies',   () => longestKDistinct('aabbcc', 3),       6);
test('k equals 0',                () => longestKDistinct('abc', 0),          0);
test('empty string',              () => longestKDistinct('', 2),             0);
test('all same characters',       () => longestKDistinct('aaaa', 2),         4);
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
