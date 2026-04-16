// Goal: Place your left hand at the cheapest item (index 0) and right hand at
// the most expensive (last index), then return immediately if their combined
// price equals the gift card amount.

function twoSum(numbers: number[], target: number): number[] {
  // Step 1: Place both hands at opposite ends of the price rack
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right]; // combined price tag
    if (sum === target) return [left + 1, right + 1]; // 1-indexed answer
    // adjustment logic comes in step 2
    break;
  }

  return [];
}

// ---Tests
test('[-1, 0] target=-1 → [1,2]', () => twoSum([-1, 0], -1), [1, 2]);
test('[1, 3] target=4 → [1,2]', () => twoSum([1, 3], 4), [1, 2]);
test('[2, 7] target=9 → [1,2]', () => twoSum([2, 7], 9), [1, 2]);
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
