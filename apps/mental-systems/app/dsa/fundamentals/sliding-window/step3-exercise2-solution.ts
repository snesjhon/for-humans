// =============================================================================
// Sliding Window — Level 3, Exercise 2: Count Rearranged Passages — SOLUTION
// =============================================================================
// Goal: Practice fixed-size window with frequency map — find all anagram windows.
//
// Build need map from pattern. Use a fixed-size window of length pattern.length.
// Track `formed` = number of chars whose count in `have` exactly meets `need`.
// Slide: add incoming char (update have and formed), remove outgoing (update have and formed).
// Each time formed === need.size, increment the count.
// =============================================================================
function countAnagramWindows(s: string, pattern: string): number {
  if (s.length < pattern.length) return 0;

  const need = new Map<string, number>();
  for (const c of pattern) need.set(c, (need.get(c) ?? 0) + 1);

  const have = new Map<string, number>();
  let formed = 0;
  let count = 0;
  const k = pattern.length;

  // Build first window
  for (let i = 0; i < k; i++) {
    const c = s[i];
    have.set(c, (have.get(c) ?? 0) + 1);
    if (need.has(c) && have.get(c) === need.get(c)) formed++;
  }
  if (formed === need.size) count++;

  // Slide
  for (let R = k; R < s.length; R++) {
    const incoming = s[R];
    have.set(incoming, (have.get(incoming) ?? 0) + 1);
    if (need.has(incoming) && have.get(incoming) === need.get(incoming)) formed++;

    const outgoing = s[R - k];
    if (need.has(outgoing) && have.get(outgoing) === need.get(outgoing)) formed--;
    have.set(outgoing, have.get(outgoing)! - 1);
    if (have.get(outgoing) === 0) have.delete(outgoing);

    if (formed === need.size) count++;
  }

  return count;
}

test('two matches',             () => countAnagramWindows('cbaebabacd', 'abc'),   2);
test('no matches',              () => countAnagramWindows('af', 'be'),            0);
test('all windows match',       () => countAnagramWindows('aaa', 'a'),            3);
test('pattern longer than s',   () => countAnagramWindows('ab', 'abc'),           0);
test('single match at start',   () => countAnagramWindows('bac', 'abc'),          1);
test('repeated chars in pattern', () => countAnagramWindows('aabab', 'aab'),      2);

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
