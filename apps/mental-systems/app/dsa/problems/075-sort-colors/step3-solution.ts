// =============================================================================
// Sort Colors — Step 3 of 3: The Blue Escort — SOLUTION
// =============================================================================
// Goal: When the Inspector spots a blue participant (2), swap them to the Blue
//       Flag position and retreat the Blue Flag — but do NOT advance the
//       Inspector, because the incoming element is unknown.

function sortColors(nums: number[]): void {
  // ✓ Step 1: Plant the three flags
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 1) {
      // ✓ Step 1: White — already in the confirmed-white zone
      mid++;
    } else if (nums[mid] === 0) {
      // ✓ Step 2: Red — swap to front, confirmed-white zone guarantees a
      //           white returns to mid, so both pointers advance safely
      swap(nums, low, mid);
      low++;
      mid++;
    } else {
      // ✓ Step 3: Blue — swap to back, but the incoming element is unknown
      //           (it came from the unexamined zone), so mid must stay put
      swap(nums, mid, high);
      high--;
      // mid intentionally NOT incremented — must re-examine the arrival
    }
  }
}

// Tests — all must print PASS
test('empty parade', () => {
  const nums: number[] = [];
  sortColors(nums);
  return nums;
}, []);

test('all blues', () => {
  const nums = [2, 2, 2];
  sortColors(nums);
  return nums;
}, [2, 2, 2]);

test('single blue', () => {
  const nums = [2];
  sortColors(nums);
  return nums;
}, [2]);

test('example 1 — full mix', () => {
  const nums = [2, 0, 2, 1, 1, 0];
  sortColors(nums);
  return nums;
}, [0, 0, 1, 1, 2, 2]);

test('example 2 — one of each', () => {
  const nums = [2, 0, 1];
  sortColors(nums);
  return nums;
}, [0, 1, 2]);

test('already sorted', () => {
  const nums = [0, 0, 1, 1, 2, 2];
  sortColors(nums);
  return nums;
}, [0, 0, 1, 1, 2, 2]);

test('reverse sorted', () => {
  const nums = [2, 2, 1, 1, 0, 0];
  sortColors(nums);
  return nums;
}, [0, 0, 1, 1, 2, 2]);

test('blue then red', () => {
  const nums = [2, 0];
  sortColors(nums);
  return nums;
}, [0, 2]);

test('consecutive blues at start', () => {
  const nums = [2, 2, 0, 1];
  sortColors(nums);
  return nums;
}, [0, 1, 2, 2]);

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
