// Goal: Use the frequency catalog to retrieve the element with the highest count.
//
// Return the element that appears most often. If two elements tie, return the
// smaller one. The input array is guaranteed non-empty.
//
// Example:
//   mostFrequent([1,2,2,3])    → 2
//   mostFrequent([5,5,5,1,1])  → 5
//   mostFrequent([1,2])        → 1   (tie — return the smaller)
function mostFrequent(nums: number[]): number {
  throw new Error('not implemented');
}

// ---Tests
test('single element', () => mostFrequent([7]), 7);
test('clear winner', () => mostFrequent([1, 2, 2, 3]), 2);
test('three-way tie picks smallest', () => mostFrequent([3, 1, 2]), 1);
test('dominant front', () => mostFrequent([5, 5, 5, 1, 1]), 5);
test('dominant back', () => mostFrequent([1, 2, 3, 3, 3]), 3);
test('two-way tie picks smaller', () => mostFrequent([4, 4, 9, 9]), 4);
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
