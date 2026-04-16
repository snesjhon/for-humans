// Goal: Practice FIFO behavior by serving guests in arrival order.
//
// Events look like:
//   "ARRIVE Ana"
//   "SERVE"
//
// Return the list of guests who get served, in the order they leave the line.
// Serving an empty line should do nothing.
//
// Example:
//   serveTicketLine(["ARRIVE Ana", "ARRIVE Ben", "SERVE"]) → ["Ana"]
//   serveTicketLine(["SERVE"])                              → []
function serveTicketLine(events: string[]): string[] {
  throw new Error('not implemented');
}

// ---Tests
test('basic service order', () => serveTicketLine(['ARRIVE Ana', 'ARRIVE Ben', 'SERVE']), ['Ana']);
test('multiple services', () => serveTicketLine(['ARRIVE Ana', 'ARRIVE Ben', 'SERVE', 'ARRIVE Cam', 'SERVE', 'SERVE']), ['Ana', 'Ben', 'Cam']);
test('serve empty line', () => serveTicketLine(['SERVE', 'SERVE']), []);
test('arrivals only', () => serveTicketLine(['ARRIVE Ana', 'ARRIVE Ben']), []);
test('interleaved events', () => serveTicketLine(['ARRIVE Kai', 'SERVE', 'ARRIVE Lux', 'ARRIVE Nia', 'SERVE']), ['Kai', 'Lux']);
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
// ---End Helpers
