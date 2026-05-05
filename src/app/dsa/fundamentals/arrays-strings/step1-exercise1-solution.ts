// Goal: Count the vowels in a string using a single pass.
//
// Return the number of vowel characters (a, e, i, o, u, case-insensitive)
// in the string.
//
// Example:
//   countVowels("hello") -> 2
//   countVowels("rhythm") -> 0
function countVowels(s: string): number {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (vowels.has(s[i].toLowerCase())) count++;
  }
  return count;
}

// ---Tests
test('counts vowels in a simple word', () => countVowels('hello'), 2);
test('counts zero vowels when none present', () => countVowels('rhythm'), 0);
test('counts all characters when all are vowels', () => countVowels('aeiou'), 5);
test('is case-insensitive', () => countVowels('AEIOU'), 5);
test('handles empty string', () => countVowels(''), 0);
test('handles mixed case and spaces', () => countVowels('Hello World'), 3);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
