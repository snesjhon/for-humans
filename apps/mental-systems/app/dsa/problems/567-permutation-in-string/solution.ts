// =============================================================================
// Permutation in String — Complete Solution
// =============================================================================

function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false; // belt shorter than the tray

  const a = 'a'.charCodeAt(0);
  const targetBag = new Array(26).fill(0); // sealed reference bag from s1
  const windowBag = new Array(26).fill(0); // current inspector's tray

  // Fill both bags with the first n tiles
  for (let i = 0; i < s1.length; i++) {
    targetBag[s1.charCodeAt(i) - a]++;
    windowBag[s2.charCodeAt(i) - a]++;
  }

  // Count how many of the 26 letter-type slots currently agree
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (targetBag[i] === windowBag[i]) matches++;
  }

  if (matches === 26) return true; // initial tray is already a match

  // Slide the tray: for each new right tile, evict the left tile
  for (let r = s1.length; r < s2.length; r++) {
    const l = r - s1.length;

    // Add right tile — check before change, change, check after
    const ri = s2.charCodeAt(r) - a;
    if (windowBag[ri] === targetBag[ri]) matches--; // agreement about to break
    windowBag[ri]++;
    if (windowBag[ri] === targetBag[ri]) matches++; // new agreement formed

    // Remove left tile — same before/after pattern
    const li = s2.charCodeAt(l) - a;
    if (windowBag[li] === targetBag[li]) matches--; // agreement about to break
    windowBag[li]--;
    if (windowBag[li] === targetBag[li]) matches++; // new agreement formed

    if (matches === 26) return true; // tray matches the reference bag
  }

  return false; // belt exhausted — no permutation found
}

// Tests — all must print PASS
test('s1 longer than s2 — no tray position', () => checkInclusion('abc', ''), false);
test('s1 longer than s2 by one', () => checkInclusion('abc', 'ab'), false);
test('initial window is exact match — same order', () => checkInclusion('ab', 'ab'), true);
test('initial window is exact match — reversed', () => checkInclusion('ab', 'ba'), true);
test('permutation found after sliding', () => checkInclusion('ab', 'eidba'), true);
test('permutation found mid-string (example 1)', () => checkInclusion('ab', 'eidbaooo'), true);
test('no permutation exists (example 2)', () => checkInclusion('ab', 'eidboaoo'), false);
test('single char — match exists', () => checkInclusion('a', 'bba'), true);
test('single char — no match', () => checkInclusion('a', 'bbb'), false);
test('s1 equals s2', () => checkInclusion('abc', 'abc'), true);
test('all same chars in s1', () => checkInclusion('aab', 'eidbaabooo'), true);

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
    } else { throw e; }
  }
}
