// Goal: Practice dispatching one scout per junction and combining its report.
//
// The guide at junction n needs the sum of all integers from n down to 1.
// Dispatch one scout to junction n-1 and trust its report. Add n to the
// scout's report and return the combined total. The base junction (n=0)
// contributes nothing — the trail is empty.
//
// Example:
//   sumDownFrom(5)  → 15
//   sumDownFrom(0)  → 0

function sumDownFrom(n: number): number {
  throw new Error('not implemented');
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
