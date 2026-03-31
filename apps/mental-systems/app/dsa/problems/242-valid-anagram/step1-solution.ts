// =============================================================================
// Valid Anagram — Step 1 of 2: The Tile Count Check — SOLUTION
// =============================================================================
// Goal: Before opening any bags, confirm both words have the same number of tiles.
//       Different lengths means different inventories — return false immediately.

function isAnagram(s: string, t: string): boolean {
  // Tile count check — different bag sizes can never hold the same inventory
  if (s.length !== t.length) return false;

  throw new Error('not implemented');
}

// Tests
test('rat vs cats — lengths differ (3 vs 4)', () => isAnagram('rat', 'cats'), false);
test('a vs empty — lengths differ (1 vs 0)', () => isAnagram('a', ''), false);
test('anagram vs nagaram — same length, needs step 2', () => isAnagram('anagram', 'nagaram'), true);
test('rat vs car — same length, needs step 2', () => isAnagram('rat', 'car'), false);

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
