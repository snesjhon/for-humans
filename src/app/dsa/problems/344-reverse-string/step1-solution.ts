// Goal: Place frontDealer at index 0 and backDealer at s.length - 1.

function reverseString(s: string[]): void {
  let frontDealer = 0;
  let backDealer = s.length - 1;
  void frontDealer; void backDealer;
}

// ---Tests
// ---Tests
test('empty array stays empty', () => {
  const s: string[] = [];
  reverseString(s);
  return s;
}, []);

test('single character stays unchanged', () => {
// ---End Tests
  const s = ['a'];
  reverseString(s);
  return s;
}, ['a']);
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
// ---End Helpers
