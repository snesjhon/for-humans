// =============================================================================
// Trapping Rain Water — Step 2 of 2: The Right Surveyor Completes the Survey — SOLUTION
// =============================================================================
// Goal: Add the right surveyor's measurement logic — when rightMark < leftMark,
//       the right gauge is the ceiling; measure water and step right inward.

function trap(height: number[]): number {
  // ✓ Step 1: Initialize surveyors and process left-ceiling positions (locked)
  let left = 0, right = height.length - 1;
  let leftMark = 0, rightMark = 0;
  let water = 0;

  while (left < right) {
    leftMark = Math.max(leftMark, height[left]);
    rightMark = Math.max(rightMark, height[right]);

    if (leftMark <= rightMark) {
      // Left gauge is the ceiling — left surveyor measures and steps inward
      water += leftMark - height[left];
      left++;
    } else {
      // Step 2: Right gauge is the ceiling — right surveyor measures and steps inward
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
