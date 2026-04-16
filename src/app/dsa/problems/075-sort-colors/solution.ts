// =============================================================================
// Sort Colors — Complete Solution (Dutch National Flag)
// =============================================================================

function sortColors(nums: number[]): void {
  let low = 0; // Red Flag: everything left is confirmed red
  let mid = 0; // Inspector: scanning the unknown zone
  let high = nums.length - 1; // Blue Flag: everything right is confirmed blue

  while (mid <= high) {
    if (nums[mid] === 1) {
      // White — already in the confirmed-white zone between low and mid
      mid++;
    } else if (nums[mid] === 0) {
      // Red — escort to front; the element returning to mid is guaranteed
      // white (it came from the confirmed-white zone), so mid++ is safe
      swap(nums, low, mid);
      low++;
      mid++;
    } else {
      // Blue — escort to back; the element returning to mid is unknown
      // (it came from the unexamined zone), so mid must stay to inspect it
      swap(nums, mid, high);
      high--;
      // mid intentionally NOT incremented
    }
  }
}

// ---Tests
test(
  'empty parade',
  () => {
    const nums: number[] = [];
    sortColors(nums);
    return nums;
  },
  [],
);

test(
  'all reds',
  () => {
    const nums = [0, 0, 0];
    sortColors(nums);
    return nums;
  },
  [0, 0, 0],
);

test(
  'all whites',
  () => {
    const nums = [1, 1, 1];
    sortColors(nums);
    return nums;
  },
  [1, 1, 1],
);

test(
  'all blues',
  () => {
    const nums = [2, 2, 2];
    sortColors(nums);
    return nums;
  },
  [2, 2, 2],
);

test(
  'single red',
  () => {
    const nums = [0];
    sortColors(nums);
    return nums;
  },
  [0],
);

test(
  'single white',
  () => {
    const nums = [1];
    sortColors(nums);
    return nums;
  },
  [1],
);

test(
  'single blue',
  () => {
    const nums = [2];
    sortColors(nums);
    return nums;
  },
  [2],
);

test(
  'example 1 — full mix',
  () => {
    const nums = [2, 0, 2, 1, 1, 0];
    sortColors(nums);
    return nums;
  },
  [0, 0, 1, 1, 2, 2],
);

test(
  'example 2 — one of each',
  () => {
    const nums = [2, 0, 1];
    sortColors(nums);
    return nums;
  },
  [0, 1, 2],
);

test(
  'already sorted',
  () => {
    const nums = [0, 0, 1, 1, 2, 2];
    sortColors(nums);
    return nums;
  },
  [0, 0, 1, 1, 2, 2],
);

test(
  'reverse sorted',
  () => {
    const nums = [2, 2, 1, 1, 0, 0];
    sortColors(nums);
    return nums;
  },
  [0, 0, 1, 1, 2, 2],
);

test(
  'reds and whites only',
  () => {
    const nums = [0, 1, 0, 1];
    sortColors(nums);
    return nums;
  },
  [0, 0, 1, 1],
);

test(
  'blues and whites only',
  () => {
    const nums = [1, 2, 1, 2];
    sortColors(nums);
    return nums;
  },
  [1, 1, 2, 2],
);

test(
  'consecutive blues at start',
  () => {
    const nums = [2, 2, 0, 1];
    sortColors(nums);
    return nums;
  },
  [0, 1, 2, 2],
);

test(
  'blue then red',
  () => {
    const nums = [2, 0];
    sortColors(nums);
    return nums;
  },
  [0, 2],
);
// ---EndTests

// ---Helpers
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
    } else {
      throw e;
    }
  }
}
