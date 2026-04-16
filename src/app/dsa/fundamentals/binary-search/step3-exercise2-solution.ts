// =============================================================================
// Binary Search — Level 3, Exercise 2: Calibrate the First Square That Covers — SOLUTION
// =============================================================================
// Goal: Search the answer rail for the smallest integer whose square reaches the target.
// =============================================================================
function smallestSquareCeil(target: number): number {
  if (target <= 0) return 0;

  let left = 0;
  let right = target;
  let answer = target;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (mid * mid >= target) {
      answer = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return answer;
}

test('square ceiling above target', () => smallestSquareCeil(20), 5);
test('perfect square stays exact', () => smallestSquareCeil(25), 5);
test('small target', () => smallestSquareCeil(1), 1);
test('zero target', () => smallestSquareCeil(0), 0);
test('between squares', () => smallestSquareCeil(50), 8);
test('next square after 2', () => smallestSquareCeil(2), 2);

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
