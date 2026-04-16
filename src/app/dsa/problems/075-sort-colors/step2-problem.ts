// Goal: When the Inspector spots a red participant (0), swap them to the Red
//       Flag position and advance both the Red Flag and the Inspector.
//
// Prior step is complete and locked inside the function body.

function sortColors(nums: number[]): void {
  // ✓ Step 1: Plant the three flags (locked)
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 1) {
      // ✓ Step 1: White — already in middle zone (locked)
      mid++;
    } else if (nums[mid] === 0) {
      // Step 2: Red — escort to the front
      throw new Error('not implemented');
    } else {
      // Step 3: Blue — handled next
      throw new Error('not implemented');
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
  'all whites',
  () => {
    const nums = [1, 1, 1];
    sortColors(nums);
    return nums;
  },
  [1, 1, 1],
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
  'single red',
  () => {
    const nums = [0];
    sortColors(nums);
    return nums;
  },
  [0],
);

test(
  'reds and whites mixed',
  () => {
    const nums = [0, 1, 0, 1];
    sortColors(nums);
    return nums;
  },
  [0, 0, 1, 1],
);

test(
  'red then white',
  () => {
    const nums = [0, 1];
    sortColors(nums);
    return nums;
  },
  [0, 1],
);

test(
  'white then red',
  () => {
    const nums = [1, 0];
    sortColors(nums);
    return nums;
  },
  [0, 1],
);
// ---End Tests

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
