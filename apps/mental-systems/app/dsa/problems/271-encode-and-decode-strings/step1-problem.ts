// =============================================================================
// Encode and Decode Strings — Step 1 of 2: Stamp Each Package with Its Label
// =============================================================================
// Goal: For each string, prepend its character count and "#" to produce one
//       continuous belt string — the encoded form.

function encode(strs: string[]): string {
  throw new Error('not implemented');
}

// Tests
test('basic two strings', () => encode(['hello', 'world']), '5#hello5#world');
test('string containing # inside', () => encode(['a#b', 'cd']), '3#a#b2#cd');
test('empty string in list', () => encode(['']), '0#');
test('empty list', () => encode([]), '');
test('single-char strings', () => encode(['a', 'b', 'c']), '1#a1#b1#c');

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
