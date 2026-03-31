// =============================================================================
// Sliding Window Maximum — Step 1 of 2: The Candidates Notebook
// =============================================================================
// Goal: Maintain a decreasing notebook of hill indices. When a new hill arrives,
// erase any back entries with heights ≤ the new hill's height, then add the new
// index. Report the front entry's height whenever the window is full (i ≥ k-1).
//
// Tests below use single-window inputs (array length = k) so front-cleaning
// never triggers — you only need the back-cleaning + recording logic.

function maxSlidingWindow(nums: number[], k: number): number[] {
  throw new Error('not implemented');
}

// Tests
test('empty array', () => maxSlidingWindow([], 3), []);
test('single element', () => maxSlidingWindow([5], 1), [5]);
test('increasing single window — back-cleaning fires repeatedly', () => maxSlidingWindow([1, 3, 2], 3), [3]);
test('decreasing single window — nothing cleaned from back', () => maxSlidingWindow([3, 1, 2], 3), [3]);

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
