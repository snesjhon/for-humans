export {};

// Real Clock, Level 2: next display boundary
// Goal: return the delay until the next exact second boundary.
function msUntilNextSecond(nowMs: number): number {
  const remainder = nowMs % 1000;
  return remainder === 0 ? 1000 : 1000 - remainder;
}

function assertEqual(actual: number, expected: number, message: string) {
  if (actual !== expected) {
    throw new Error(`FAIL: ${message}. Expected ${expected}, received ${actual}`);
  }

  console.log(`PASS: ${message}`);
}

test('msUntilNextSecond returns the delay to the next exact second boundary', () => {
  assertEqual(msUntilNextSecond(12_345), 655, '345ms into a second leaves 655ms');
  assertEqual(msUntilNextSecond(12_999), 1, '999ms into a second leaves 1ms');
  assertEqual(msUntilNextSecond(12_000), 1000, 'exact boundary waits a full second');
});
