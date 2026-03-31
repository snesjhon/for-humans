// =============================================================================
// Merge Sorted Array — Step 2 of 2: Fill from the Right — SOLUTION
// =============================================================================
// Goal: While Team B has trophies remaining, compare the current tallest from
//       each team and place the winner at the write pedestal. Move that marker
//       and the write marker left. Stop when Team B is exhausted.

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // ✓ Step 1: Place the three markers (locked)
  if (n === 0) return;
  let p1 = m - 1;      // A-marker: rightmost real trophy on Team A's shelf
  let p2 = n - 1;      // B-marker: rightmost trophy on Team B's shelf
  let write = m + n - 1; // write marker: rightmost pedestal

  // Step 2: Fill from the right — compare tallest trophies, place the winner
  while (p2 >= 0) {
    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      // Team A's trophy is taller — move it to the write pedestal
      nums1[write] = nums1[p1];
      p1--;
    } else {
      // Team B's trophy wins (or Team A is exhausted) — place Team B's
      nums1[write] = nums2[p2];
      p2--;
    }
    write--; // write marker always steps left
  }
  // When p2 < 0: Team B is done. Remaining Team A trophies are already placed.
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
