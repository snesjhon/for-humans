// =============================================================================
// Valid Anagram — Step 2 of 2: Fill and Drain the Bag
// =============================================================================
// Goal: Scan s to fill the tile tally, then scan t to drain it.
//       If any letter in t has no tile left in the bag, return false.
//       If all tiles drain cleanly, return true.
//
// Step 1 is complete and locked.

function isAnagram(s: string, t: string): boolean {
  // ✓ Step 1: Tile count check — different bag sizes can never match (locked)
  if (s.length !== t.length) return false;

  throw new Error('not implemented');
}

// Tests
test('rat vs cats — lengths differ', () => isAnagram('rat', 'cats'), false);
test('a vs empty — lengths differ', () => isAnagram('a', ''), false);
test('anagram vs nagaram — valid anagram', () => isAnagram('anagram', 'nagaram'), true);
test('rat vs car — same letters, different counts', () => isAnagram('rat', 'car'), false);
test('ab vs ba — two-letter swap', () => isAnagram('ab', 'ba'), true);
test('aa vs bb — same length, no matching tiles', () => isAnagram('aa', 'bb'), false);
test('empty vs empty — trivially equal', () => isAnagram('', ''), true);

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
