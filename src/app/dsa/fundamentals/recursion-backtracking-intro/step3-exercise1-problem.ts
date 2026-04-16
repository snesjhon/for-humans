// =============================================================================
// Recursion & Backtracking Intro — Level 3, Exercise 1: Scout All Binary Trails
// =============================================================================
// Goal: Generate all binary strings of length n using backtracking.
//       At each position the trail forks: go left ('0') or right ('1').
//       Record the full string only when the scout's trail reaches length n.
//
// The scout pattern (leaf-only recording):
//   - Base camp: current.length === n → record current, return
//   - Recursive case: fork left (append '0', recurse), then fork right (append '1', recurse)
//
// No undo needed here because strings are immutable — each fork passes a new
// string down rather than mutating a shared pack.
//
// Example:
//   generateBinaryStrings(1) → ['0', '1']             (sorted)
//   generateBinaryStrings(2) → ['00', '01', '10', '11']  (sorted)
//   generateBinaryStrings(3) → 8 strings               (sorted)
// =============================================================================
function generateBinaryStrings(n: number): string[] {
  throw new Error('not implemented');
}

function sorted(arr: string[]): string[] {
  return [...arr].sort();
}

test('n=0 → single empty string', () => sorted(generateBinaryStrings(0)), ['']);
test('n=1 → two strings', () => sorted(generateBinaryStrings(1)), ['0', '1']);
test('n=2 → four strings in order', () => sorted(generateBinaryStrings(2)), ['00', '01', '10', '11']);
test('n=3 → eight strings', () => sorted(generateBinaryStrings(3)).length, 8);
test('n=3 starts with 000', () => sorted(generateBinaryStrings(3))[0], '000');
test('n=3 ends with 111', () => sorted(generateBinaryStrings(3))[7], '111');

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
    } else {
      throw e;
    }
  }
}
// ---End Helpers
