// Goal: Merge two sorted arrays in-place from the right using three pointers.
//
// nums1 has m valid elements followed by n zeros as extra space.
// nums2 has n elements.
// Merge nums2 into nums1 in sorted non-descending order, in-place.
//
// Example:
//   merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3) -> nums1 becomes [1, 2, 2, 3, 5, 6]
//   merge([1], 1, [], 0)                         -> nums1 stays [1]
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let write = m + n - 1;
  while (i >= 0 && j >= 0) {
    if (nums1[i] >= nums2[j]) {
      nums1[write] = nums1[i];
      i--;
    } else {
      nums1[write] = nums2[j];
      j--;
    }
    write--;
  }
  while (j >= 0) {
    nums1[write] = nums2[j];
    j--;
    write--;
  }
}

// ---Tests
test('merges two equal-length arrays', () => {
  const nums1 = [1, 2, 3, 0, 0, 0];
  merge(nums1, 3, [2, 5, 6], 3);
  return nums1;
}, [1, 2, 2, 3, 5, 6]);
test('nums2 all smaller than nums1', () => {
  const nums1 = [4, 5, 6, 0, 0, 0];
  merge(nums1, 3, [1, 2, 3], 3);
  return nums1;
}, [1, 2, 3, 4, 5, 6]);
test('nums2 all larger than nums1', () => {
  const nums1 = [1, 2, 3, 0, 0, 0];
  merge(nums1, 3, [4, 5, 6], 3);
  return nums1;
}, [1, 2, 3, 4, 5, 6]);
test('nums1 has no valid elements', () => {
  const nums1 = [0, 0, 0];
  merge(nums1, 0, [1, 2, 3], 3);
  return nums1;
}, [1, 2, 3]);
test('nums2 is empty', () => {
  const nums1 = [1];
  merge(nums1, 1, [], 0);
  return nums1;
}, [1]);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers
