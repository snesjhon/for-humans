// =============================================================================
// Trapping Rain Water — Complete Solution
// =============================================================================

function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMark = 0, rightMark = 0; // each surveyor's high-water mark gauge
  let water = 0;

  while (left < right) {
    leftMark = Math.max(leftMark, height[left]);    // left surveyor updates gauge
    rightMark = Math.max(rightMark, height[right]); // right surveyor updates gauge

    if (leftMark <= rightMark) {
      // Left gauge is the lower ceiling — water depth is exact; step left inward
      water += leftMark - height[left];
      left++;
    } else {
      // Right gauge is the lower ceiling — water depth is exact; step right inward
      water += rightMark - height[right];
      right--;
    }
  }

  return water;
}

// Tests — all must print PASS
test('empty terrain', () => trap([]), 0);
test('symmetric valley', () => trap([3, 0, 3]), 3);
test('right wall tallest', () => trap([2, 0, 1, 0, 3]), 5);
test('LeetCode example 1', () => trap([0,1,0,2,1,0,1,3,2,1,2,1]), 6);
test('LeetCode example 2', () => trap([4,2,0,3,2,5]), 9);
test('single bar — no water possible', () => trap([5]), 0);
test('two bars — no valley between them', () => trap([3, 4]), 0);
test('plateau — all same height', () => trap([2, 2, 2]), 0);

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
