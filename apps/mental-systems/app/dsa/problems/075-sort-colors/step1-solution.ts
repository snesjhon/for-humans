// =============================================================================
// Sort Colors — Step 1 of 3: Plant the Three Flags — SOLUTION
// =============================================================================
// Goal: Set up low, mid, high pointers and handle white participants (1s) by
//       advancing the Inspector through the confirmed-white zone.

function sortColors(nums: number[]): void {
  // Plant the three flags
  let low = 0;               // Red Flag: everything left is confirmed red
  let mid = 0;               // Inspector: examining the unknown zone
  let high = nums.length - 1; // Blue Flag: everything right is confirmed blue

  while (mid <= high) {
    if (nums[mid] === 1) {
      // White — already in the confirmed-white zone between low and mid
      mid++;
    } else {
      // Red and blue — handled in steps 2 and 3
      throw new Error('not implemented');
    }
  }
}

// Tests — all must print PASS
test('empty parade', () => {
  const nums: number[] = [];
  sortColors(nums);
  return nums;
}, []);

test('all whites — Inspector walks straight through', () => {
  const nums = [1, 1, 1];
  sortColors(nums);
  return nums;
}, [1, 1, 1]);

test('single white participant', () => {
  const nums = [1];
  sortColors(nums);
  return nums;
}, [1]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function swap(arr: number[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

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
