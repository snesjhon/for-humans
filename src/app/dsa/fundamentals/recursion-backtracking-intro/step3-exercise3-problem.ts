// =============================================================================
// Recursion & Backtracking Intro — Level 3, Exercise 3: Combinations of Exact Size
// =============================================================================
// Goal: Find all subsets of nums of exactly size k using backtracking with pruning.
//       Prune early when there are not enough remaining items to fill the pack.
//
// The scout pattern (size constraint + pruning):
//   backtrack(start):
//     if pack.length === k → record snapshot, return
//     if pack.length + (nums.length - start) < k → return (can't fill pack)
//     loop from start to end:
//       pack the item (push)
//       recurse with start = i+1
//       unpack the item (pop) ← mandatory
//
// Example:
//   combinationsOfSize([1,2,3], 2) → [[1,2], [1,3], [2,3]]
//   combinationsOfSize([1,2,3], 0) → [[]]   (empty combination)
//   combinationsOfSize([1,2,3], 4) → []     (can't fill — prune immediately)
// =============================================================================
function combinationsOfSize(nums: number[], k: number): number[][] {
  throw new Error('not implemented');
}

function sortedSubsets(r: number[][]): number[][] {
  return r.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

test('k=2 from [1,2,3]', () => sortedSubsets(combinationsOfSize([1, 2, 3], 2)), [[1, 2], [1, 3], [2, 3]]);
test('k=2 from [1,2,3,4]', () => sortedSubsets(combinationsOfSize([1, 2, 3, 4], 2)), [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
test('k=3: only full array', () => sortedSubsets(combinationsOfSize([1, 2, 3], 3)), [[1, 2, 3]]);
test('k=0: empty combination', () => sortedSubsets(combinationsOfSize([1, 2, 3], 0)), [[]]);
test('k > length: empty result', () => sortedSubsets(combinationsOfSize([1, 2, 3], 4)), []);
test('k=1: each element alone', () => sortedSubsets(combinationsOfSize([1, 2, 3], 1)), [[1], [2], [3]]);

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
