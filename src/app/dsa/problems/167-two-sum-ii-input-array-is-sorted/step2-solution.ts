// Goal: Add the three-way branch inside the while loop — if the combined price
// is too high, move the right hand left; if too low, move the left hand right;
// if exact, return the 1-indexed pair.

function twoSum(numbers: number[], target: number): number[] {
  // ✓ Step 1: Starting positions — left hand at cheapest, right at most expensive
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right]; // combined price tag
    if (sum === target) return [left + 1, right + 1]; // exact match — 1-indexed
    else if (sum > target) right--; // too expensive — right hand moves to cheaper item
    else left++;                    // too cheap — left hand moves to pricier item
  }

  return []; // guaranteed not to reach here (problem ensures one solution)
}

// ---Tests
test('[-1, 0] target=-1 → [1,2]', () => twoSum([-1, 0], -1), [1, 2]);
test('[1, 3] target=4 → [1,2]', () => twoSum([1, 3], 4), [1, 2]);
test('[2, 7] target=9 → [1,2]', () => twoSum([2, 7], 9), [1, 2]);
test('[2, 7, 11, 15] target=18 → [2,3]', () => twoSum([2, 7, 11, 15], 18), [2, 3]);
test('[2, 3, 4] target=6 → [1,3]', () => twoSum([2, 3, 4], 6), [1, 3]);
test('[1, 2, 3, 4] target=7 → [3,4]', () => twoSum([1, 2, 3, 4], 7), [3, 4]);
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
    } else {
      throw e;
    }
  }
}
