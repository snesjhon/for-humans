// Goal: Add the hiking loop — while scouts haven't met, measure the basin,
//       track the best, and advance the shorter-wall scout inward.

function maxArea(height: number[]): number {
  // ✓ Step 1: Place scouts at the outermost walls
  let left = 0;
  let right = height.length - 1;

  // Step 2: Hike inward, recording the best basin along the way
  let best = 0;
  while (left < right) {
    // Water level is the shorter cliff; capacity = water level × gap between scouts
    const waterLevel = Math.min(height[left], height[right]);
    const capacity = waterLevel * (right - left);
    best = Math.max(best, capacity);

    // Move the shorter-wall scout — only it has a chance of finding a better basin
    if (height[left] <= height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return best;
}

// ---Tests
test('two equal walls', () => maxArea([2, 2]), 2);
test('left wall taller', () => maxArea([3, 1]), 1);
test('LeetCode example 1', () => maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
test('LeetCode example 2', () => maxArea([1, 1]), 1);
test('symmetric equal ends', () => maxArea([4, 3, 2, 1, 4]), 16);
test('ascending walls', () => maxArea([1, 2, 3, 4, 5]), 6);
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
