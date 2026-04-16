// Goal: While Team B has trophies remaining, compare the current tallest from
//       each team and place the winner at the write pedestal. Move that marker
//       and the write marker left. Stop when Team B is exhausted.

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // ✓ Step 1: Place the three markers (locked)
  if (n === 0) return;
  let p1 = m - 1;
  let p2 = n - 1;
  let write = m + n - 1;

  throw new Error('not implemented');
}

// ---Tests
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
// ---End Tests
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
