// =============================================================================
// Merge Sorted Array — Complete Solution
// =============================================================================

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  if (n === 0) return; // Team B shelf is empty — nothing to do

  let p1 = m - 1;       // A-marker: rightmost real trophy on Team A's shelf
  let p2 = n - 1;       // B-marker: rightmost trophy on Team B's shelf
  let write = m + n - 1; // write marker: rightmost pedestal (fills left from here)

  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[write] = nums1[p1]; // Team A's trophy is taller — claim this pedestal
      p1--;
    } else {
      nums1[write] = nums2[p2]; // Team B's trophy wins (or Team A is exhausted)
      p2--;
    }
    write--; // write marker steps left after every placement
  }
  // p2 < 0: Team B is done. Any remaining Team A trophies are already in place.
}

// Tests — all must print PASS
test('Team B empty: no merging needed', () => {
  const n1 = [1, 2, 3]; merge(n1, 3, [], 0); return n1;
}, [1, 2, 3]);

test('basic merge: alternating winners', () => {
  const n1 = [1, 2, 3, 0, 0, 0]; merge(n1, 3, [2, 5, 6], 3); return n1;
}, [1, 2, 2, 3, 5, 6]);

test('Team A empty: all from Team B', () => {
  const n1 = [0]; merge(n1, 0, [1], 1); return n1;
}, [1]);

test('all Team A smaller: Team B placed last', () => {
  const n1 = [1, 2, 3, 0, 0, 0]; merge(n1, 3, [4, 5, 6], 3); return n1;
}, [1, 2, 3, 4, 5, 6]);

test('duplicates across teams', () => {
  const n1 = [1, 2, 2, 0, 0, 0]; merge(n1, 3, [2, 3, 5], 3); return n1;
}, [1, 2, 2, 2, 3, 5]);

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
