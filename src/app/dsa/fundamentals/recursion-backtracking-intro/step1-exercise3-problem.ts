// Goal: Practice the Summit Rule with an indexed array instead of a single integer.
//
// The guide at index i dispatches one scout to index i+1. Compare arr[i] against
// the scout's report and return the larger value. The base fires when the index
// reaches the end of the array — return -Infinity so any real element wins the
// first comparison.
//
// Example:
//   trailMax([3, 1, 5, 2], 0)  → 5
//   trailMax([3, 1, 5, 2], 2)  → 5
//   trailMax([], 0)            → -Infinity

function trailMax(arr: number[], i: number): number {
  throw new Error('not implemented');
}

// ---Tests
test('empty range', () => trailMax([], 0), -Infinity);
test('single element', () => trailMax([7], 0), 7);
test('max at front', () => trailMax([9, 3, 1], 0), 9);
test('max at back', () => trailMax([1, 3, 9], 0), 9);
test('max in middle', () => trailMax([3, 9, 1], 0), 9);
test('start mid-range', () => trailMax([3, 9, 1], 1), 9);
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
    } else {
      throw e;
    }
  }
}
// ---End Helpers
