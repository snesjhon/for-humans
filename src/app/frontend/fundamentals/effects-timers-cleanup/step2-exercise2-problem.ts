export {};

// Real Clock, Level 2: derive from the deadline
// Goal: compute remaining whole seconds from the actual deadline and current time.
function getRemainingSeconds(targetTimeMs: number, nowMs: number): number {
  // TODO: derive from the timestamp difference.
  // Use ceiling so 1ms remaining still shows 1 second.
  return 0;
}

function assertEqual(actual: number, expected: number, message: string) {
  if (actual !== expected) {
    throw new Error(`FAIL: ${message}. Expected ${expected}, received ${actual}`);
  }

  console.log(`PASS: ${message}`);
}

test.todo('getRemainingSeconds derives whole seconds from the deadline and current time');
