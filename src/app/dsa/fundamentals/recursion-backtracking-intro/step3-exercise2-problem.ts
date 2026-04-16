// =============================================================================
// Recursion & Backtracking Intro — Level 3, Exercise 2: Collect Matching Waypoints
// =============================================================================
// Goal: Find all subsets of nums that sum to exactly target.
//       Use the choose-explore-undo template with a shared pack array.
//       Record the pack only when its sum equals target (not at every arrival).
//
// The scout pattern (conditional recording):
//   backtrack(start, currentSum):
//     if currentSum === target → record snapshot of pack, return
//     loop from start to end:
//       pack the item (push)
//       recurse with start = i+1, sum = currentSum + nums[i]
//       unpack the item (pop) ← mandatory, always paired with push
//
// Example:
//   collectSumK([1,2,3], 3) → [[1,2], [3]]   (sorted)
//   collectSumK([1,2,3], 6) → [[1,2,3]]
//   collectSumK([1,2,3], 0) → [[]]            (empty subset sums to 0)
// =============================================================================
function collectSumK(nums: number[], target: number): number[][] {
  throw new Error('not implemented');
}

function sortedSubsets(r: number[][]): number[][] {
  return r.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

test('sums to 3: [1,2] and [3]', () => sortedSubsets(collectSumK([1, 2, 3], 3)), [[1, 2], [3]]);
test('sums to 6: full array only', () => sortedSubsets(collectSumK([1, 2, 3], 6)), [[1, 2, 3]]);
test('target=0: empty subset', () => sortedSubsets(collectSumK([1, 2, 3], 0)), [[]]);
test('empty array, target=0', () => sortedSubsets(collectSumK([], 0)), [[]]);
test('no subset sums to 10', () => sortedSubsets(collectSumK([1, 2, 3], 10)), []);
test('[1,2,3,4] sums to 4: [1,3] and [4]', () => sortedSubsets(collectSumK([1, 2, 3, 4], 4)), [[1, 3], [4]]);

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
