// =============================================================================
// Permutation in String — Step 1 of 2: Sealing the Reference Bag — SOLUTION
// =============================================================================
// Goal: Build targetBag from s1 and windowBag from the first len(s1) chars of s2,
//       count the initial matches across all 26 slots, and return true if matches === 26.

function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false; // belt shorter than the tray — no valid position

  const a = 'a'.charCodeAt(0);
  const targetBag = new Array(26).fill(0); // sealed reference bag from s1
  const windowBag = new Array(26).fill(0); // initial tray filled from s2[0..n-1]

  for (let i = 0; i < s1.length; i++) {
    targetBag[s1.charCodeAt(i) - a]++; // count each tile in the reference bag
    windowBag[s2.charCodeAt(i) - a]++; // fill the tray with the first n tiles
  }

  // Count how many of the 26 letter-type slots currently agree
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (targetBag[i] === windowBag[i]) matches++;
  }

  if (matches === 26) return true; // tray already matches the reference bag

  throw new Error('not implemented'); // Step 2: slide the tray
}

// Tests — all must print PASS
test('s1 longer than s2 — no tray position possible', () => checkInclusion('abc', ''), false);
test('s1 longer than s2 by one', () => checkInclusion('abc', 'ab'), false);
test('initial window is exact match — same order', () => checkInclusion('ab', 'ab'), true);
test('initial window is exact match — reversed', () => checkInclusion('ab', 'ba'), true);
test('single char match at start', () => checkInclusion('a', 'a'), true);

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
