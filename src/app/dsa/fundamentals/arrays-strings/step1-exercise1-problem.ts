// Goal: Practice the most direct form of the reader + writer.
//
// The conveyor belt carries integers — some positive, some zero, some negative.
// Keep only the positive values (> 0) at the front, in their original order.
// Everything else is discarded off the belt.
// Return the count of items written.
//
// The reader reads every slot without skipping.
// The writer only advances when the reader finds a positive value.
//
// Example:
//   keepPositives([-1, 3, 0, 2, -4, 5]) → 3   (belt becomes [3, 2, 5, ...])
//   keepPositives([0, -1, -2])           → 0   (nothing to write)
function keepPositives(nums: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('mixed signs',     () => keepPositives([-1, 3, 0, 2, -4, 5]),  3);
test('none positive',   () => keepPositives([0, -1, -2]),            0);
test('all positive',    () => keepPositives([1, 2, 3]),              3);
test('empty belt',      () => keepPositives([]),                     0);
test('single positive', () => keepPositives([4]),                    1);
test('single zero',     () => keepPositives([0]),                    0);
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
