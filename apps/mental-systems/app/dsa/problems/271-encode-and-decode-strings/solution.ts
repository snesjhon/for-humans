// =============================================================================
// Encode and Decode Strings — Complete Solution
// =============================================================================
// Encode: stamp each string with a length label "N#" then its contents
// Decode: walk the belt with a cursor, read each label, count out that many chars

function encode(strs: string[]): string {
  // For each package, stamp its count label and contents, join into one belt
  return strs.map(s => `${s.length}#${s}`).join('');
}

function decode(s: string): string[] {
  const clipboard: string[] = []; // accumulates recovered packages
  let pos = 0;                    // cursor — always at the first digit of the next label

  while (pos < s.length) {
    const hashPos = s.indexOf('#', pos); // the # that ends this label (never inside content)
    const len = parseInt(s.slice(pos, hashPos)); // digit string before # = package size
    const start = hashPos + 1;             // content begins right after #
    clipboard.push(s.slice(start, start + len)); // count out exactly len characters
    pos = start + len;                     // advance to the first digit of the next label
  }

  return clipboard;
}

// Tests — all must print PASS
test('encode: basic', () => encode(['hello', 'world']), '5#hello5#world');
test('encode: string with # inside', () => encode(['a#b', 'cd']), '3#a#b2#cd');
test('encode: empty string in list', () => encode(['']), '0#');
test('encode: empty list', () => encode([]), '');
test('encode: single-char strings', () => encode(['a', 'b', 'c']), '1#a1#b1#c');

test('decode: basic two strings', () => decode('5#hello5#world'), ['hello', 'world']);
test('decode: string with # inside', () => decode('3#a#b2#cd'), ['a#b', 'cd']);
test('decode: empty string', () => decode('0#'), ['']);
test('decode: empty belt', () => decode(''), []);
test('decode: single-char strings', () => decode('1#a1#b1#c'), ['a', 'b', 'c']);

test('round-trip: basic', () => decode(encode(['hello', 'world'])), ['hello', 'world']);
test('round-trip: # inside strings', () => decode(encode(['a#b', 'cd'])), ['a#b', 'cd']);
test('round-trip: empty string', () => decode(encode([''])), ['']);
test('round-trip: empty list', () => decode(encode([])), []);
test('round-trip: mixed content', () => decode(encode(['3#abc', '0#', ''])), ['3#abc', '0#', '']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
