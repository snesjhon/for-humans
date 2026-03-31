// =============================================================================
// Longest Consecutive Sequence — Step 2 of 2: Expanding Each Opener into Its Full Chain
// =============================================================================
// Goal: For every series opener found in Step 1, walk forward through consecutive
//       spine numbers to measure the full chain length.

function longestConsecutive(nums: number[]): number {
  // ✓ Step 1: Build catalog + identify openers (locked)
  const catalog = new Set<number>(nums);
  let longestRun = 0;

  for (const volume of catalog) {
    if (!catalog.has(volume - 1)) {
      longestRun = Math.max(longestRun, 1);

      throw new Error('not implemented'); // expand this opener into its full chain
    }
  }

  return longestRun;
}

// Tests — step 1 cases plus multi-volume chains
test('empty array', () => longestConsecutive([]), 0);
test('single volume', () => longestConsecutive([1]), 1);
test('all disjoint', () => longestConsecutive([10, 5, 100]), 1);
test('duplicates collapse', () => longestConsecutive([1, 1, 1]), 1);
test('finds 4-volume series', () => longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
test('finds 9-volume series', () => longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
test('two equal-length runs', () => longestConsecutive([1, 2, 3, 10, 11, 12]), 3);
test('negative numbers', () => longestConsecutive([-3, -2, -1, 0, 1]), 5);

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
    } else { throw e; }
  }
}
