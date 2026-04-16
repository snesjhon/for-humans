// Goal: After warming up, slide the spotlight across the rest of the array —
//       add the incoming performer, drop the outgoing performer, track the best.

function findMaxAverage(nums: number[], k: number): number {
  // ✓ Step 1: Warm the spotlight — sum first k performers (locked)
  let spotlightSum = 0;
  for (let i = 0; i < k; i++) {
    spotlightSum += nums[i];
  }
  let bestSpotlight = spotlightSum;

  throw new Error('not implemented');
}

// Step 1 tests still pass (arrays of exactly length k)
// ---Tests
test('single performer', () => findMaxAverage([5], 1), 5);
test('two performers, equal', () => findMaxAverage([3, 3], 2), 3);
test('three performers', () => findMaxAverage([2, 4, 6], 3), 4);

// Step 2 tests — require sliding to find a better window
test('LeetCode example 1', () => findMaxAverage([1,12,-5,-6,50,3], 4), 12.75);
test('best window at the end', () => findMaxAverage([1, 2, 3, 4, 5], 2), 4.5);
test('all same score', () => findMaxAverage([3, 3, 3, 3], 2), 3);
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
