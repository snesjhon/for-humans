// =============================================================================
// Find the Duplicate Number — Complete Solution
// =============================================================================

function findDuplicate(nums: number[]): number {
  let slow = nums[0]; // walker takes the first hallway out of the lobby
  let fast = nums[nums[0]]; // sprinter takes two hallways out of the lobby

  while (slow !== fast) {
    slow = nums[slow]; // walker follows one hallway sign
    fast = nums[nums[fast]]; // sprinter follows two hallway signs
  } // first collision happens somewhere on the carousel

  let finder = 0; // reset walker starts back at the lobby entrance
  while (finder !== slow) {
    finder = nums[finder]; // move from the hallway entrance
    slow = nums[slow]; // move from the meeting room
  }

  return finder; // both travelers meet at the duplicate room number
}

// Tests — all must print PASS
runCase('two-room hallway [1,1] returns duplicate 1', () => findDuplicate([1, 1]), 1);
runCase('[1,3,4,2,2] returns duplicate 2', () => findDuplicate([1, 3, 4, 2, 2]), 2);
runCase('[3,1,3,4,2] returns duplicate 3', () => findDuplicate([3, 1, 3, 4, 2]), 3);
runCase('[3,3,3,3,3] returns duplicate 3', () => findDuplicate([3, 3, 3, 3, 3]), 3);
runCase('[2,5,9,6,9,3,8,9,7,1] returns duplicate 9', () => findDuplicate([2, 5, 9, 6, 9, 3, 8, 9, 7, 1]), 9);

// ---Helpers

function runCase(desc: string, fn: () => unknown, expected: unknown): void {
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
