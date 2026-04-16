// Goal: Walk the belt with a cursor — for each label, parse the count, skip "#",
//       take exactly that many characters, advance the cursor, repeat until empty.

function encode(strs: string[]): string {
  // ✓ Step 1: Stamp each package's length label onto the belt (locked)
  return strs.map(s => `${s.length}#${s}`).join('');
}

function decode(s: string): string[] {
  const clipboard: string[] = []; // recovered packages
  let pos = 0;                    // cursor — always at the start of the next label

  while (pos < s.length) {
    const hashPos = s.indexOf('#', pos); // find the # that ends this label
    const len = parseInt(s.slice(pos, hashPos)); // digits before # = package size
    const start = hashPos + 1;            // first character of content, right after #
    clipboard.push(s.slice(start, start + len)); // count out exactly len characters
    pos = start + len;                    // advance cursor to start of next label
  }

  return clipboard;
}

// ---Tests
test('encode: basic', () => encode(['hello', 'world']), '5#hello5#world');
test('encode: string with # inside', () => encode(['a#b', 'cd']), '3#a#b2#cd');
test('encode: empty string', () => encode(['']), '0#');
test('encode: empty list', () => encode([]), '');

test('decode: basic two strings', () => decode('5#hello5#world'), ['hello', 'world']);
test('decode: string with # inside', () => decode('3#a#b2#cd'), ['a#b', 'cd']);
test('decode: empty string', () => decode('0#'), ['']);
test('decode: empty belt', () => decode(''), []);
test('decode: single-char strings', () => decode('1#a1#b1#c'), ['a', 'b', 'c']);
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
