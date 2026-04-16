// Goal: Set up the townLog Map and scan right, recording each town's most recent
// mile marker. Compute maxHaul as the window grows.

function lengthOfLongestSubstring(s: string): number {
  const townLog = new Map<string, number>(); // town name → last visited mile marker
  let left = 0;
  let maxHaul = 0;

  for (let right = 0; right < s.length; right++) {
    const town = s[right];

    // Step 1: record this town in the travel log (always update to current mile)
    townLog.set(town, right);

    // Measure the active haul — both endpoints inclusive
    maxHaul = Math.max(maxHaul, right - left + 1);
  }

  return maxHaul;
}

// ---Tests
test('empty string', () => lengthOfLongestSubstring(''), 0);
test('single character', () => lengthOfLongestSubstring('a'), 1);
test('all unique — abc', () => lengthOfLongestSubstring('abc'), 3);
test('all unique — abcde', () => lengthOfLongestSubstring('abcde'), 5);
test('all unique — abcdef', () => lengthOfLongestSubstring('abcdef'), 6);
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
    } else {
      throw e;
    }
  }
}
