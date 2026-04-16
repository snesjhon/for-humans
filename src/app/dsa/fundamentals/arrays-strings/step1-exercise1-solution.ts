// Goal: Practice the most direct form of the reader + writer.
//
// The reader reads every slot. The writer only advances when
// the reader finds a positive value — it writes the keeper into slot writer,
// then bumps writer forward by one. Everything else is skipped off the belt.
function keepPositives(nums: number[]): number {
  let writer = 0;
  for (let reader = 0; reader < nums.length; reader++) {
    if (nums[reader] > 0) {
      nums[writer] = nums[reader];
      writer++;
    }
  }
  return writer;
}

// ---Tests
test('mixed signs',     () => keepPositives([-1, 3, 0, 2, -4, 5]),  3);
test('none positive',   () => keepPositives([0, -1, -2]),            0);
test('all positive',    () => keepPositives([1, 2, 3]),              3);
test('empty belt',      () => keepPositives([]),                     0);
test('single positive', () => keepPositives([4]),                    1);
test('single zero',     () => keepPositives([0]),                    0);
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
