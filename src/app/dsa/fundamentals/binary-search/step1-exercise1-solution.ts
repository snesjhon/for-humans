// =============================================================================
// Binary Search — Level 1, Exercise 1: Probe the Exact Checkpoint — SOLUTION
// =============================================================================
// Goal: Use the surveyor's midpoint probe to find one exact mark on the rail.
// =============================================================================
function findCheckpoint(checkpoints: number[], target: number): number {
  let left = 0;
  let right = checkpoints.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (checkpoints[mid] === target) return mid;
    if (checkpoints[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

test('exact checkpoint in middle', () => findCheckpoint([4, 8, 12, 16, 23, 31], 23), 4);
test('exact checkpoint at start', () => findCheckpoint([2, 5, 9, 12], 2), 0);
test('exact checkpoint at end', () => findCheckpoint([2, 5, 9, 12], 12), 3);
test('checkpoint missing', () => findCheckpoint([2, 5, 9, 12], 7), -1);
test('single mark present', () => findCheckpoint([11], 11), 0);
test('empty rail', () => findCheckpoint([], 11), -1);

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
// ---End Helpers
