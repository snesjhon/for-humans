// Goal: Initialize the stamp album (Set) and return false by default —
//       no duplicates have been found before any scanning begins.

function containsDuplicate(nums: number[]): boolean {
  // Open the album — no stamp designs recorded yet
  const stampAlbum = new Set<number>();

  // No scanning in step 1; default answer is "no duplicates found"
  return false;
}

// ---Tests
test('empty pile has no duplicates', () => containsDuplicate([]), false);
test('single stamp has no duplicates', () => containsDuplicate([42]), false);
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
