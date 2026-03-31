// =============================================================================
// Valid Anagram — Complete Solution
// =============================================================================

function isAnagram(s: string, t: string): boolean {
  // Tile count check — different bag sizes can never hold the same inventory
  if (s.length !== t.length) return false;

  // Fill the tile bag from s — one tile per letter
  const tileBag = new Map<string, number>();
  for (const letter of s) {
    tileBag.set(letter, (tileBag.get(letter) ?? 0) + 1);
  }

  // Drain the tile bag with t — miss means not an anagram
  for (const letter of t) {
    const count = tileBag.get(letter) ?? 0;
    if (count === 0) return false; // no tile left to pull
    tileBag.set(letter, count - 1);
  }

  return true;
}

// Tests — all must print PASS
test('rat vs cats — lengths differ', () => isAnagram('rat', 'cats'), false);
test('a vs empty — lengths differ', () => isAnagram('a', ''), false);
test('anagram vs nagaram — valid anagram', () => isAnagram('anagram', 'nagaram'), true);
test('rat vs car — same letters, wrong counts', () => isAnagram('rat', 'car'), false);
test('ab vs ba — two-letter swap', () => isAnagram('ab', 'ba'), true);
test('aa vs bb — same length, no matching tiles', () => isAnagram('aa', 'bb'), false);
test('empty vs empty — trivially equal', () => isAnagram('', ''), true);
test('aab vs baa — repeated tiles', () => isAnagram('aab', 'baa'), true);

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
