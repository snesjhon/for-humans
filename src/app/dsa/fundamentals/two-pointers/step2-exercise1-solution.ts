// Goal: Practice the greedy gate — move the shorter wall, track the max.
//
// At each step compute area = min(h[L], h[R]) * (R - L).
// Move the pointer at the shorter wall: moving the taller wall can only hurt
// (the shorter wall still limits the water level while width shrinks).
// On equal heights, move L — the skipped pair on R's side is no better.
function maxContainerArea(heights: number[]): number {
  let L = 0, R = heights.length - 1;
  let maxArea = 0;
  while (L < R) {
    const area = Math.min(heights[L], heights[R]) * (R - L);
    maxArea = Math.max(maxArea, area);
    if (heights[L] <= heights[R]) L++;
    else R--;
  }
  return maxArea;
}

// ---Tests
test('basic valley',         () => maxContainerArea([3, 1, 5, 2, 4]),              12);
test('classic example',      () => maxContainerArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
test('two walls',            () => maxContainerArea([1, 1]),                        1);
test('symmetric equal',      () => maxContainerArea([4, 3, 2, 1, 4]),             16);
test('tall single middle',   () => maxContainerArea([1, 2, 4, 3, 1]),              4);
test('ascending heights',    () => maxContainerArea([1, 2, 3, 4, 5]),              6);
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
    } else { throw e; }
  }
}
