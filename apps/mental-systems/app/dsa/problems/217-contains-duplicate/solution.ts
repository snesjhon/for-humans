// =============================================================================
// Contains Duplicate — Complete Solution
// =============================================================================

function containsDuplicate(nums: number[]): boolean {
  const stampAlbum = new Set<number>(); // open empty album — no designs yet

  for (const stamp of nums) {
    if (stampAlbum.has(stamp)) return true; // design already mounted → duplicate!
    stampAlbum.add(stamp);                  // new design → mount it in the album
  }

  return false; // pile exhausted, every stamp design was unique
}

// Tests — all must print PASS
test('has duplicate at end', () => containsDuplicate([1, 2, 3, 1]), true);
test('no duplicates', () => containsDuplicate([1, 2, 3, 4]), false);
test('all same value', () => containsDuplicate([1, 1, 1, 1]), true);
test('two elements duplicate', () => containsDuplicate([1, 1]), true);
test('two elements unique', () => containsDuplicate([1, 2]), false);
test('empty pile', () => containsDuplicate([]), false);
test('single stamp', () => containsDuplicate([7]), false);
test('duplicate in middle', () => containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true);
test('large no duplicates', () => containsDuplicate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), false);

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
    } else {
      throw e;
    }
  }
}
