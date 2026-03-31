// =============================================================================
// Arrays & Strings — Level 2, Exercise 2: Do the Inspectors Agree? — SOLUTION
// =============================================================================
function isPalindrome(s: string): boolean {
  let L = 0, R = s.length - 1;
  while (L < R) {
    if (s[L] !== s[R]) return false;
    L++;
    R--;
  }
  return true;
}

test('classic palindrome',       () => isPalindrome('racecar'), true);
test('not a palindrome',         () => isPalindrome('hello'),   false);
test('single char',              () => isPalindrome('a'),       true);
test('empty string',             () => isPalindrome(''),        true);
test('even-length palindrome',   () => isPalindrome('abba'),    true);
test('even-length non-palindrome', () => isPalindrome('abcd'), false);

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
