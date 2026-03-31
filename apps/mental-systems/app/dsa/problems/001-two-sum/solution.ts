// =============================================================================
// Two Sum — Complete Solution
// =============================================================================

function twoSum(nums: number[], target: number): number[] {
  const guestBook = new Map<number, number>(); // name-tag number → seat index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]; // the partner that completes the magic sum

    if (guestBook.has(complement)) {
      return [guestBook.get(complement)!, i]; // complement's seat + current seat
    }

    guestBook.set(nums[i], i); // write this guest into the book for future arrivals
  }

  return [];
}

// Tests — all must print PASS
test('finds pair at start', () => twoSum([2, 7, 11, 15], 9), [0, 1]);
test('finds pair in middle', () => twoSum([3, 2, 4], 6), [1, 2]);
test('finds duplicate pair', () => twoSum([3, 3], 6), [0, 1]);
test('finds pair near end', () => twoSum([1, 2, 3, 7], 9), [1, 3]);

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
