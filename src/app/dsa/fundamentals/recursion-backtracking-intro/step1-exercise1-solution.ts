// Goal: Practice dispatching one scout per junction and combining its report.

function sumDownFrom(n: number): number {
  if (n === 0) return 0;
  return n + sumDownFrom(n - 1);
}

// ---Tests
test('base junction (n=0)', () => sumDownFrom(0), 0);
test('single junction (n=1)', () => sumDownFrom(1), 1);
test('three junctions', () => sumDownFrom(3), 6);
test('five junctions', () => sumDownFrom(5), 15);
test('ten junctions', () => sumDownFrom(10), 55);
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
