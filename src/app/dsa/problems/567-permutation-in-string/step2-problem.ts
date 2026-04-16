// Goal: Slide the tray across s2, adding the right tile and removing the left tile
//       each step, updating matches with the before/after pattern, and returning
//       true when matches === 26 or false when the belt is exhausted.

function checkInclusion(s1: string, s2: string): boolean {
  // ✓ Step 1: Build both bags and check the initial tray position (locked)
  if (s1.length > s2.length) return false;

  const a = 'a'.charCodeAt(0);
  const targetBag = new Array(26).fill(0);
  const windowBag = new Array(26).fill(0);

  for (let i = 0; i < s1.length; i++) {
    targetBag[s1.charCodeAt(i) - a]++;
    windowBag[s2.charCodeAt(i) - a]++;
  }

  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (targetBag[i] === windowBag[i]) matches++;
  }

  if (matches === 26) return true;

  throw new Error('not implemented');
}

// ---Tests
test('s1 longer than s2 — no tray position', () => checkInclusion('abc', ''), false);
test('s1 longer than s2 by one', () => checkInclusion('abc', 'ab'), false);
test('initial window is exact match — reversed', () => checkInclusion('ab', 'ba'), true);
test('permutation found after sliding', () => checkInclusion('ab', 'eidba'), true);
test('permutation found mid-string', () => checkInclusion('ab', 'eidbaooo'), true);
test('no permutation exists', () => checkInclusion('ab', 'eidboaoo'), false);
test('single char — match exists', () => checkInclusion('a', 'bba'), true);
test('single char — no match', () => checkInclusion('a', 'bbb'), false);
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
    } else { throw e; }
  }
}
