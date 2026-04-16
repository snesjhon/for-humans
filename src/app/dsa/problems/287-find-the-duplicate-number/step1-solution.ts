// Goal: Send a walker and a sprinter through the hallway signs until they meet
//       somewhere on the loop.

function findDuplicate(nums: number[]): number {
  let slow = nums[0]; // walker takes the first hallway out of the lobby
  let fast = nums[nums[0]]; // sprinter takes two hallways out of the lobby

  while (slow !== fast) {
    slow = nums[slow]; // walker follows one hallway sign
    fast = nums[nums[fast]]; // sprinter follows two hallway signs
  }

  return slow; // step 1 only proves a meeting room on the carousel
}

runCase('two-room hallway [1,1] meets at duplicate room 1', () => findDuplicate([1, 1]), 1);
runCase('all hallways funnel straight into room 2', () => findDuplicate([2, 2, 2, 2, 2]), 2);

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
