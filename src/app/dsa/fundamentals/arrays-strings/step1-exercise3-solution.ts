function compactEvens(nums: number[]): number {
  let writer = 0;
  for (let reader = 0; reader < nums.length; reader++) {
    if (nums[reader] % 2 === 0) {
      nums[writer] = nums[reader];
      writer++;
    }
  }
  return writer;
}

// ---Tests
test('mixed',        () => compactEvens([1, 2, 3, 4, 5, 6]), 3);
test('no evens',     () => compactEvens([1, 3, 5]),           0);
test('all evens',    () => compactEvens([2, 4, 6]),           3);
test('empty',        () => compactEvens([]),                  0);
test('single even',  () => compactEvens([2]),                 1);
test('single odd',   () => compactEvens([1]),                 0);
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
