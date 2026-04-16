// Goal: Place Inspector Left at the entrance (index 0) and Inspector Right at
//       the exit (s.length - 1), then loop while they haven't met.

function isPalindrome(s: string): boolean {
  // Step 1: Place inspectors at opposite ends of the corridor
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Comparison logic goes in steps 2 and 3 — for now just advance
    left++;
    right--;
  }

  // Reached the middle without a mismatch
  return true;
}

// ---Tests
test('empty string is a palindrome', () => isPalindrome(''), true);
test('single character is a palindrome', () => isPalindrome('a'), true);
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
