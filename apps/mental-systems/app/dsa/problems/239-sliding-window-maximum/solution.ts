// =============================================================================
// Sliding Window Maximum — Complete Solution
// =============================================================================

function maxSlidingWindow(nums: number[], k: number): number[] {
  const vistas: number[] = [];     // reported maximum for each window position
  const notebook: number[] = [];   // hill indices; heights always decreasing front→back

  for (let i = 0; i < nums.length; i++) {
    // Back-clean: erase peaks shorter than the new arrival (they can never win)
    while (notebook.length > 0 && nums[notebook[notebook.length - 1]] <= nums[i]) {
      notebook.pop();
    }
    notebook.push(i); // new hill is now a candidate

    // Front-clean: drop peaks that scrolled past the telescope's left edge
    if (notebook[0] < i - k + 1) {
      notebook.shift();
    }

    // Window is full — the front is always the tallest peak in view
    if (i >= k - 1) {
      vistas.push(nums[notebook[0]]);
    }
  }

  return vistas;
}

// Tests — all must print PASS
test('empty array', () => maxSlidingWindow([], 3), []);
test('single element', () => maxSlidingWindow([1], 1), [1]);
test('k equals array length', () => maxSlidingWindow([3, 1, 2], 3), [3]);
test('front-cleaning required', () => maxSlidingWindow([3, 1, 2], 2), [3, 2]);
test('main example', () => maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
test('all equal elements', () => maxSlidingWindow([2, 2, 2, 2], 2), [2, 2, 2]);
test('strictly decreasing', () => maxSlidingWindow([5, 4, 3, 2, 1], 3), [5, 4, 3]);
test('strictly increasing', () => maxSlidingWindow([1, 2, 3, 4, 5], 3), [3, 4, 5]);
test('k equals 1', () => maxSlidingWindow([4, 2, 7, 1], 1), [4, 2, 7, 1]);

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
