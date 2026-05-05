// Goal: Check if a string is a palindrome using converging two pointers.
//
// Return true if the string reads the same forwards and backwards.
// Consider only alphanumeric characters and ignore case.
//
// Example:
//   isPalindrome("racecar")                    -> true
//   isPalindrome("A man a plan a canal Panama") -> true
//   isPalindrome("hello")                       -> false
function isPalindrome(s: string): boolean {
  throw new Error('not implemented');
}

// ---Tests
test('simple palindrome', () => isPalindrome('racecar'), true);
test('classic phrase ignoring spaces and case', () => isPalindrome('A man a plan a canal Panama'), true);
test('non-palindrome', () => isPalindrome('hello'), false);
test('empty string is a palindrome', () => isPalindrome(''), true);
test('single character', () => isPalindrome('a'), true);
test('two matching characters', () => isPalindrome('aa'), true);
test('two non-matching characters', () => isPalindrome('ab'), false);
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
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers
