// Goal: Write a helper that converts any word into its catalog code
//       by sorting its letters alphabetically.

function catalogCode(word: string): string {
  // Split into letters, sort alphabetically, rejoin — the canonical form
  return word.split('').sort().join('');
}

// ---Tests
test('eat → aet', () => catalogCode('eat'), 'aet');
test('tea → aet (same code as eat)', () => catalogCode('tea'), 'aet');
test('ate → aet (same code as eat and tea)', () => catalogCode('ate'), 'aet');
test('tan → ant', () => catalogCode('tan'), 'ant');
test('nat → ant (same code as tan)', () => catalogCode('nat'), 'ant');
test('bat → abt', () => catalogCode('bat'), 'abt');
test('empty string → empty string', () => catalogCode(''), '');
test('single letter → same letter', () => catalogCode('a'), 'a');
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
