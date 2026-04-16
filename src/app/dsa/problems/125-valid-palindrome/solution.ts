// =============================================================================
// Valid Palindrome — Complete Solution
// =============================================================================

function isPalindrome(s: string): boolean {
  // Place Inspector Left at the entrance, Inspector Right at the exit
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Inspector Left skips empty pedestals (non-alphanumeric clutter)
    while (left < right && !isAlphanumeric(s[left])) {
      left++;
    }

    // Inspector Right skips empty pedestals
    while (left < right && !isAlphanumeric(s[right])) {
      right--;
    }

    // Both inspectors are at real exhibits — compare case-insensitively
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false; // Exhibits don't match — corridor is not symmetric
    }

    // Exhibits matched — both inspectors step inward
    left++;
    right--;
  }

  // Inspectors met in the middle without a single mismatch — it's a palindrome
  return true;
}

// Tests — all must print PASS
test('empty string is a palindrome', () => isPalindrome(''), true);
test('single character is a palindrome', () => isPalindrome('a'), true);
test('spaces only is a palindrome', () => isPalindrome(' '), true);
test('"racecar" is a palindrome', () => isPalindrome('racecar'), true);
test('"hello" is not a palindrome', () => isPalindrome('hello'), false);
test('"A man, a plan, a canal: Panama" is a palindrome', () => isPalindrome('A man, a plan, a canal: Panama'), true);
test('"race a car" is not a palindrome', () => isPalindrome('race a car'), false);
test('digits palindrome "12321"', () => isPalindrome('12321'), true);
test('mixed case "Aba" is a palindrome', () => isPalindrome('Aba'), true);
test('punctuation only is a palindrome', () => isPalindrome(',.!'), true);
test('"0P" is not a palindrome', () => isPalindrome('0P'), false);

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
