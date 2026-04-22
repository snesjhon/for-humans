// Goal: Practice the Summit Rule with an indexed array instead of a single integer.

function trailMax(arr: number[], i: number): number {
  if (i >= arr.length) return -Infinity;
  return Math.max(arr[i], trailMax(arr, i + 1));
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
