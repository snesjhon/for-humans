// Goal: Walk through every stamp in the pile; if the current design is already
//       in the album, return true immediately. Otherwise mount it and continue.
//       Return false after the pile is exhausted with no duplicates found.

function containsDuplicate(nums: number[]): boolean {
  // ✓ Step 1: Open the album — no stamp designs recorded yet
  const stampAlbum = new Set<number>();

  // Step 2: Examine each stamp — check before mounting
  for (const stamp of nums) {
    if (stampAlbum.has(stamp)) return true; // design already mounted → duplicate!
    stampAlbum.add(stamp);                  // new design → mount it in the album
  }

  return false; // pile exhausted with no repeat designs found
}

// ---Tests
test('has duplicate at end', () => containsDuplicate([1, 2, 3, 1]), true);
test('no duplicates', () => containsDuplicate([1, 2, 3, 4]), false);
test('all same value', () => containsDuplicate([1, 1, 1, 1]), true);
test('two elements duplicate', () => containsDuplicate([1, 1]), true);
test('two elements unique', () => containsDuplicate([1, 2]), false);
test('empty pile', () => containsDuplicate([]), false);
test('single stamp', () => containsDuplicate([7]), false);
test('duplicate in middle', () => containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true);
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
