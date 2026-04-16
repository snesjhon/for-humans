// =============================================================================
// Binary Search — Level 2, Exercise 3: Find the First Green Light
// =============================================================================
// Goal: Search a monotone pass/fail rail and find where green begins.
//
// The surveyor sees a sorted boolean rail where all false marks come first,
// then all true marks. Return the first index holding true, or -1 if none do.
//
// Example:
//   firstPassingMark([false, false, true, true]) → 2
//   firstPassingMark([false, false, false])      → -1
// =============================================================================
function firstPassingMark(results: boolean[]): number {
  throw new Error('not implemented');
}

test('green starts in middle', () => firstPassingMark([false, false, true, true]), 2);
test('green starts at beginning', () => firstPassingMark([true, true, true]), 0);
test('no green mark', () => firstPassingMark([false, false, false]), -1);
test('single green mark', () => firstPassingMark([true]), 0);
test('single red mark', () => firstPassingMark([false]), -1);
test('late green start', () => firstPassingMark([false, false, false, false, true]), 4);

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
// ---End Helpers
