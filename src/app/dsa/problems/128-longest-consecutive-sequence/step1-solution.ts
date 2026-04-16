// Goal: Register every volume in the catalog (Set), then scan for series openers —
//       volumes whose predecessor is absent — and record each as a run of length 1.

function longestConsecutive(nums: number[]): number {
  const catalog = new Set<number>(nums); // register every volume — O(1) lookup, deduplicates
  let longestRun = 0;

  for (const volume of catalog) {
    // Series Opener Rule: only a volume with no predecessor starts a fresh series
    if (!catalog.has(volume - 1)) {
      longestRun = Math.max(longestRun, 1); // each opener contributes at least 1
    }
  }

  return longestRun;
}

// ---Tests
test('empty array', () => longestConsecutive([]), 0);
test('single volume', () => longestConsecutive([1]), 1);
test('all disjoint — every volume is its own opener', () => longestConsecutive([10, 5, 100]), 1);
test('duplicates collapse in catalog', () => longestConsecutive([1, 1, 1]), 1);
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
    } else { throw e; }
  }
}
