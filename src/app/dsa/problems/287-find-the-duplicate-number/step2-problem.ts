// Goal: After the meeting, start a reset walker from the lobby and move both
//       travelers one sign per beat until they meet at the duplicate room.

function findDuplicate(nums: number[]): number {
  // ✓ Step 1: force a meeting somewhere on the carousel (locked)
  let slow = nums[0];
  let fast = nums[nums[0]];

  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[nums[fast]];
  }

  throw new Error('not implemented');
}

runCase('two-room hallway [1,1] returns duplicate 1', () => findDuplicate([1, 1]), 1);
runCase('[1,3,4,2,2] returns duplicate 2', () => findDuplicate([1, 3, 4, 2, 2]), 2);
runCase('[3,1,3,4,2] returns duplicate 3', () => findDuplicate([3, 1, 3, 4, 2]), 3);
runCase('[3,3,3,3,3] returns duplicate 3', () => findDuplicate([3, 3, 3, 3, 3]), 3);

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
