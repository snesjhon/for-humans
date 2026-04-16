// =============================================================================
// Recursion & Backtracking Intro — Level 1, Exercise 3: Sum the Waypoints
// =============================================================================
// Goal: Recursively sum all digits of a non-negative integer.
//       Each digit is one waypoint on the mountain; the guide collects them
//       by peeling off the last digit and delegating the rest.
//
// The mountain guide rule:
//   - Base camp: n < 10 → return n (single digit, answered directly)
//   - Recursive case: dispatch sumDigits(Math.floor(n / 10)), add last digit (n % 10)
//
// Example:
//   sumDigits(0)   → 0
//   sumDigits(9)   → 9
//   sumDigits(12)  → 3   (1 + 2)
//   sumDigits(456) → 15  (4 + 5 + 6)
//   sumDigits(999) → 27
// =============================================================================
function sumDigits(n: number): number {
  throw new Error('not implemented');
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
