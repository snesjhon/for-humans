// Goal: After back-cleaning and adding index i, check whether the notebook's
// front entry has scrolled past the window's left edge. If so, remove it.
// This ensures the front always refers to a hill inside the current window.
//
// Prior step is complete and locked inside the function body.

function maxSlidingWindow(nums: number[], k: number): number[] {
  // ✓ Step 1: Back-clean + add + record (locked)
  const vistas: number[] = [];
  const notebook: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    while (notebook.length > 0 && nums[notebook[notebook.length - 1]] <= nums[i]) {
      notebook.pop();
    }
    notebook.push(i);

    // Step 2: Front-clean — drop entries that scrolled past the left edge
    throw new Error('not implemented');
  }

  return vistas;
}

// ---Tests
test('empty array', () => maxSlidingWindow([], 3), []);
test('single element', () => maxSlidingWindow([1], 1), [1]);
test('front-cleaning required — old max scrolls out', () => maxSlidingWindow([3, 1, 2], 2), [3, 2]);
test('main example', () => maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
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
