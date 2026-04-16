// =============================================================================
// Binary Search — Level 1, Exercise 1: Probe the Exact Checkpoint
// =============================================================================
// Goal: Use the surveyor's midpoint probe to find one exact mark on the rail.
//
// A surveyor has a sorted rail of checkpoint numbers.
// Return the index of target, or -1 if the exact checkpoint is not present.
//
// Example:
//   findCheckpoint([4, 8, 12, 16, 23, 31], 23) → 4
//   findCheckpoint([4, 8, 12, 16, 23, 31], 15) → -1
// =============================================================================
function findCheckpoint(checkpoints: number[], target: number): number {
  throw new Error('not implemented');
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
