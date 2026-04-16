// Goal: Build a frequency catalog by counting how often each character appears
//       in a string — one pass, no scanning.
//
// Count how many times each character appears in the string and return a plain
// object mapping character → count.
//
// Example:
//   countChars('aabbc')  → { a:2, b:2, c:1 }
//   countChars('hello')  → { h:1, e:1, l:2, o:1 }
//   countChars('')       → {}

function countChars() {
  throw new Error('not implemented');
}

// ---Tests
test('empty string', () => countChars(''), {});
test('single char', () => countChars('z'), { z: 1 });
test('all same', () => countChars('aaaa'), { a: 4 });
test('two chars', () => countChars('aabbc'), { a: 2, b: 2, c: 1 });
test('hello', () => countChars('hello'), { h: 1, e: 1, l: 2, o: 1 });
test('mixed', () => countChars('abcabc'), { a: 2, b: 2, c: 2 });
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
