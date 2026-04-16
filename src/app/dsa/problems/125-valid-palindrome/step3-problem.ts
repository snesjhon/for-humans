// Goal: After both inspectors land on real exhibits, compare them
//       case-insensitively; return false on mismatch, advance inward on match.

function isPalindrome(s: string): boolean {
  // ✓ Step 1: Place inspectors at opposite ends (locked)
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // ✓ Step 2: Skip empty pedestals (locked)
    while (left < right && !isAlphanumeric(s[left])) {
      left++;
    }
    while (left < right && !isAlphanumeric(s[right])) {
      right--;
    }

    throw new Error('not implemented');
  }

  return true;
}

// ---Tests
test('empty string is a palindrome', () => isPalindrome(''), true);
test('single character is a palindrome', () => isPalindrome('a'), true);
test('spaces only is a palindrome', () => isPalindrome(' '), true);
test('"racecar" is a palindrome', () => isPalindrome('racecar'), true);
test('"hello" is not a palindrome', () => isPalindrome('hello'), false);
test('"A man, a plan, a canal: Panama" is a palindrome', () => isPalindrome('A man, a plan, a canal: Panama'), true);
test('"race a car" is not a palindrome', () => isPalindrome('race a car'), false);
test('digits palindrome "12321"', () => isPalindrome('12321'), true);
test('mixed case "Aba" is a palindrome', () => isPalindrome('Aba'), true);
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
