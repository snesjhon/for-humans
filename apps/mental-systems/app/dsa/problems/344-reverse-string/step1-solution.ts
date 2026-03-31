// =============================================================================
// Reverse an Array — Step 1 of 2: Station the Two Dealers — SOLUTION
// =============================================================================
// Goal: Place frontDealer at index 0 and backDealer at index arr.length - 1.

function reverseArray(arr: number[]): void {
  // ✓ Step 1: Station the dealers at opposite ends of the card table
  let frontDealer = 0;              // front dealer at the first card
  let backDealer = arr.length - 1;  // back dealer at the last card
  // march and swap come in step 2
  void frontDealer; void backDealer;
}

// Tests — all must print PASS
test('empty array stays empty', () => {
  const arr: number[] = [];
  reverseArray(arr);
  return arr;
}, []);

test('single element stays unchanged', () => {
  const arr = [1];
  reverseArray(arr);
  return arr;
}, [1]);

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
