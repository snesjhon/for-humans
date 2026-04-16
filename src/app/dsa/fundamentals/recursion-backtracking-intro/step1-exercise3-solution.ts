// =============================================================================
// Recursion & Backtracking Intro — Level 1, Exercise 3: Sum the Waypoints — SOLUTION
// =============================================================================
// Goal: Recursively sum all digits of a non-negative integer.
function sumDigits(n: number): number {
  if (n < 10) return n;                              // base camp — single digit
  return (n % 10) + sumDigits(Math.floor(n / 10));  // peel off last digit, delegate rest
}

test('single digit 0', () => sumDigits(0), 0);
test('single digit 9', () => sumDigits(9), 9);
test('two digits: 12 → 3', () => sumDigits(12), 3);
test('three digits: 456 → 15', () => sumDigits(456), 15);
test('repeated nines: 999 → 27', () => sumDigits(999), 27);
test('trailing zeros: 1000 → 1', () => sumDigits(1000), 1);

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
