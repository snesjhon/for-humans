export {};

// Real Clock, Level 2: derive from the deadline
// Goal: compute remaining whole seconds from the actual deadline and current time.
function getRemainingSeconds(targetTimeMs: number, nowMs: number): number {
  const remainingMs = targetTimeMs - nowMs;
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

function assertEqual(actual: number, expected: number, message: string) {
  if (actual !== expected) {
    throw new Error(`FAIL: ${message}. Expected ${expected}, received ${actual}`);
  }

  console.log(`PASS: ${message}`);
}

test('getRemainingSeconds derives whole seconds from the deadline and current time', () => {
  assertEqual(getRemainingSeconds(25_000, 21_800), 4, '3.2 seconds remaining still shows 4');
  assertEqual(getRemainingSeconds(25_000, 24_999), 1, '1ms remaining still shows 1');
  assertEqual(getRemainingSeconds(25_000, 25_000), 0, 'deadline reached shows 0');
  assertEqual(getRemainingSeconds(25_000, 27_100), 0, 'past the deadline stays clamped at 0');
});
