export {};

// Real Clock, Level 2: next display boundary
// Goal: return the delay until the next exact second boundary.
function msUntilNextSecond(nowMs: number): number {
  // TODO: compute how many milliseconds remain until the clock reaches the next second.
  return 1000;
}

function assertEqual(actual: number, expected: number, message: string) {
  if (actual !== expected) {
    throw new Error(`FAIL: ${message}. Expected ${expected}, received ${actual}`);
  }

  console.log(`PASS: ${message}`);
}

test.todo('msUntilNextSecond returns the delay to the next exact second boundary');
