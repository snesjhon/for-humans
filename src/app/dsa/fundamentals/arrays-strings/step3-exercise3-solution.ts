function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const output = new Array(n).fill(1);

  // Forward pass: output[i] holds product of all elements to the left
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    output[i] = prefix;
    prefix *= nums[i];
  }

  // Backward pass: multiply in product of all elements to the right
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    output[i] *= suffix;
    suffix *= nums[i];
  }

  return output;
}

// ---Tests
test('basic four',    () => productExceptSelf([1, 2, 3, 4]),    [24, 12, 8, 6]);
test('two elements',  () => productExceptSelf([2, 3]),           [3, 2]);
test('with zero',     () => productExceptSelf([1, 0, 3, 4]),    [0, 12, 0, 0]);
test('two zeros',     () => productExceptSelf([0, 0]),           [0, 0]);
test('with negative', () => productExceptSelf([-1, 2, -3, 4]), [-24, 12, -8, 6]);
test('all ones',      () => productExceptSelf([1, 1, 1]),        [1, 1, 1]);
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
    } else { throw e; }
  }
}
