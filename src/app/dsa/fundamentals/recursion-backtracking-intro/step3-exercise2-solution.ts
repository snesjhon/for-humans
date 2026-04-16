// =============================================================================
// Recursion & Backtracking Intro — Level 3, Exercise 2: Collect Matching Waypoints — SOLUTION
// =============================================================================
// Goal: Find all subsets of nums that sum to exactly target.
function collectSumK(nums: number[], target: number): number[][] {
  const results: number[][] = [];
  const pack: number[] = [];

  function backtrack(start: number, currentSum: number): void {
    if (currentSum === target) {
      results.push([...pack]);  // snapshot — never push the live pack reference
      return;
    }
    for (let i = start; i < nums.length; i++) {
      pack.push(nums[i]);                           // pack the item (go down the fork)
      backtrack(i + 1, currentSum + nums[i]);       // explore everything from here
      pack.pop();                                   // unpack (return to the fork)
    }
  }

  backtrack(0, 0);
  return results;
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
