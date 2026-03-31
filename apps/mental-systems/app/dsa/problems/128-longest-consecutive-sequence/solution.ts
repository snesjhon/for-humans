// =============================================================================
// Longest Consecutive Sequence — Complete Solution
// =============================================================================

function longestConsecutive(nums: number[]): number {
  const catalog = new Set<number>(nums); // register every volume for O(1) lookup
  let longestRun = 0;

  for (const volume of catalog) {
    // Series Opener Rule: only start counting from volumes with no predecessor
    if (!catalog.has(volume - 1)) {
      let currentVolume = volume;
      let seriesLength = 1;

      // Walk forward through consecutive spine numbers until the chain breaks
      while (catalog.has(currentVolume + 1)) {
        currentVolume++;
        seriesLength++;
      }

      longestRun = Math.max(longestRun, seriesLength);
    }
  }

  return longestRun;
}

// Tests — all must print PASS
test('finds 4-volume series', () => longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
test('finds 9-volume series', () => longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
test('empty array', () => longestConsecutive([]), 0);
test('single volume', () => longestConsecutive([1]), 1);
test('no consecutive volumes', () => longestConsecutive([10, 5, 100]), 1);
test('duplicates collapse', () => longestConsecutive([1, 1, 1]), 1);
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
