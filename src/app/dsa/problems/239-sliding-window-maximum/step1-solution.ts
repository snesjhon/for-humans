// Goal: Maintain a decreasing notebook of hill indices. When a new hill arrives,
// erase any back entries with heights ≤ the new hill's height, then add the new
// index. Report the front entry's height whenever the window is full (i ≥ k-1).

function maxSlidingWindow(nums: number[], k: number): number[] {
  const vistas: number[] = [];     // reported maximums per window
  const notebook: number[] = [];   // hill indices; heights decreasing front→back

  for (let i = 0; i < nums.length; i++) {
    // Step 1: Back-clean — erase hills shorter than the new arrival
    while (notebook.length > 0 && nums[notebook[notebook.length - 1]] <= nums[i]) {
      notebook.pop(); // this hill can never be the max while nums[i] is in the window
    }
    notebook.push(i); // record the new hill's position

    // Report when window is full (front-cleaning added in step 2)
    if (i >= k - 1) {
      vistas.push(nums[notebook[0]]); // notebook front is always the tallest
    }
  }

  return vistas;
}

// ---Tests
test('empty array', () => maxSlidingWindow([], 3), []);
test('single element', () => maxSlidingWindow([5], 1), [5]);
test('increasing single window — back-cleaning fires repeatedly', () => maxSlidingWindow([1, 3, 2], 3), [3]);
test('decreasing single window — nothing cleaned from back', () => maxSlidingWindow([3, 1, 2], 3), [3]);
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
