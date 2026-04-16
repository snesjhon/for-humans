// Goal: Initialize both surveyors and implement the left surveyor's logic —
//       update the left gauge, then measure water when leftMark <= rightMark.

function trap(height: number[]): number {
  throw new Error('not implemented');
}

// so the left surveyor handles every position
// ---Tests
test('empty terrain — no walls, no water', () => trap([]), 0);
test('symmetric valley — left side bottleneck', () => trap([3, 0, 3]), 3);
test('right wall tallest — left surveyor measures all', () => trap([2, 0, 1, 0, 3]), 5);
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
    } else {
      throw e;
    }
  }
}
