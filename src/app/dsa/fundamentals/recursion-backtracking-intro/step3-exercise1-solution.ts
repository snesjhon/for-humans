// =============================================================================
// Recursion & Backtracking Intro — Level 3, Exercise 1: Scout All Binary Trails — SOLUTION
// =============================================================================
// Goal: Generate all binary strings of length n using backtracking.
function generateBinaryStrings(n: number): string[] {
  const results: string[] = [];

  function scout(current: string): void {
    if (current.length === n) {  // base camp — full trail reached
      results.push(current);
      return;
    }
    scout(current + '0');  // fork left
    scout(current + '1');  // fork right
    // No pop needed — strings are immutable, each fork gets its own copy
  }

  scout('');
  return results;
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
