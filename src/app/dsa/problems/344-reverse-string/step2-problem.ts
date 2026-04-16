// Goal: While frontDealer < backDealer, swap s[frontDealer] with s[backDealer]
//       using heldCard as a temporary grip, then step both pointers inward.
//
// Step 1 is complete and locked inside the function body.

function reverseString(s: string[]): void {
  // ✓ Step 1: Station the dealers at opposite ends (locked)
  let frontDealer = 0;
  let backDealer = s.length - 1;

  throw new Error('not implemented');
}

// ---Tests
// ---Tests
test('empty array stays empty', () => {
  const s: string[] = [];
  reverseString(s);
  return s;
}, []);

test('single character stays unchanged', () => {
  const s = ['a'];
  reverseString(s);
  return s;
}, ['a']);

test('two characters swap', () => {
  const s = ['a', 'b'];
  reverseString(s);
  return s;
}, ['b', 'a']);

test('reverses odd-length array', () => {
  const s = ['h', 'e', 'l', 'l', 'o'];
  reverseString(s);
  return s;
}, ['o', 'l', 'l', 'e', 'h']);

test('reverses even-length array', () => {
// ---End Tests
  const s = ['H', 'a', 'n', 'n', 'a', 'h'];
  reverseString(s);
  return s;
}, ['h', 'a', 'n', 'n', 'a', 'H']);
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
