// Goal: Handle the n=0 edge case (Team B shelf is empty) and initialize the
//       three markers: A-marker (p1), B-marker (p2), and write marker.

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  throw new Error('not implemented');
}

// ---Tests
test('Team B empty: no merging needed', () => {
// ---End Tests
  const n1 = [1, 2, 3]; merge(n1, 3, [], 0); return n1;
}, [1, 2, 3]);

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
