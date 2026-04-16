// Goal: Inside the loop, advance each inspector past any non-alphanumeric
//       character before stopping to compare.

function isPalindrome(s: string): boolean {
  // ✓ Step 1: Place inspectors at opposite ends (locked)
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    throw new Error('not implemented');
  }

  return true;
}

// ---Tests
test('empty string is a palindrome', () => isPalindrome(''), true);
test('single character is a palindrome', () => isPalindrome('a'), true);
test('spaces only is a palindrome', () => isPalindrome('   '), true);
test('punctuation only is a palindrome', () => isPalindrome(',.!'), true);
// ---End Tests

// ---Helpers

function isAlphanumeric(c: string): boolean {
  return /[a-zA-Z0-9]/.test(c);
}

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
