// Goal: Apply the reader + writer with your own keep condition.
//
// The belt carries a mix of odd and even numbers. Your writer has a new rule:
// only write even numbers. Odd numbers roll off the belt without being placed.
// Return the count of even items written.
//
// The reader still reads every slot — the only thing that changed is which
// items qualify as keepers.
//
// Example:
//   compactEvens([1, 2, 3, 4, 5, 6]) → 3   (belt becomes [2, 4, 6, ...])
//   compactEvens([1, 3, 5])           → 0   (nothing to write)
function compactEvens(nums: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('mixed',        () => compactEvens([1, 2, 3, 4, 5, 6]), 3);
test('no evens',     () => compactEvens([1, 3, 5]),           0);
test('all evens',    () => compactEvens([2, 4, 6]),           3);
test('empty',        () => compactEvens([]),                  0);
test('single even',  () => compactEvens([2]),                 1);
test('single odd',   () => compactEvens([1]),                 0);
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
