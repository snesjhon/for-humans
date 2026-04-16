// Goal: Handle the n=0 edge case (Team B shelf is empty) and initialize the
//       three markers: A-marker (p1), B-marker (p2), and write marker.

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // If Team B's shelf is empty, no merging needed
  if (n === 0) return;

  // Three markers: last real trophy in Team A, last in Team B, last pedestal
  let p1 = m - 1;  // A-marker: rightmost real trophy on Team A's shelf
  let p2 = n - 1;  // B-marker: rightmost trophy on Team B's shelf
  let write = m + n - 1; // write marker: rightmost pedestal on the combined shelf

  // (filling loop comes in step 2)
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
