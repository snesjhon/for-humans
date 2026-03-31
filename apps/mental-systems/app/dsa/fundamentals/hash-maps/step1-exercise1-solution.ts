// =============================================================================
// Hash Maps & Sets — Level 1, Exercise 1: File the Catalog Cards — SOLUTION
// =============================================================================
// Goal: Build a frequency catalog by counting how often each character appears
//       in a string — one pass, no scanning.
function countChars(s: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const ch of s) {
    freq[ch] = (freq[ch] ?? 0) + 1;
  }
  return freq;
}

test('empty string', () => countChars(''), {});
test('single char', () => countChars('z'), { z: 1 });
test('all same', () => countChars('aaaa'), { a: 4 });
test('two chars', () => countChars('aabbc'), { a: 2, b: 2, c: 1 });
test('hello', () => countChars('hello'), { h: 1, e: 1, l: 2, o: 1 });
test('mixed', () => countChars('abcabc'), { a: 2, b: 2, c: 2 });

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
