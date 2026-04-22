// Goal: Practice the Summit Rule with a multiplication combination instead of addition.

function scoutPower(base: number, exp: number): number {
  if (exp === 0) return 1;
  return base * scoutPower(base, exp - 1);
}

// ---Tests
test('zero exponent returns 1', () => scoutPower(2, 0), 1);
test('exponent 1 returns base', () => scoutPower(7, 1), 7);
test('2 to the 10th', () => scoutPower(2, 10), 1024);
test('3 cubed', () => scoutPower(3, 3), 27);
test('base 1 any exponent', () => scoutPower(1, 100), 1);
test('5 squared', () => scoutPower(5, 2), 25);
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
// ---End Helpers
