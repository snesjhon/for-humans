// Goal: Practice FIFO service using an arrival shelf and a service shelf.
//
// Events look like:
//   "ARRIVE Ana"
//   "FRONT"
//   "SERVE"
//
// Return the answers for every "FRONT" or "SERVE" event.
// If the desk is empty for one of those events, report null.
//
// Example:
//   runTwoShelfDesk(["ARRIVE Ana", "ARRIVE Ben", "FRONT", "SERVE"]) → ["Ana", "Ana"]
function runTwoShelfDesk(events: string[]): Array<string | null> {
  throw new Error('not implemented');
}

// ---Tests
test('front then serve', () => runTwoShelfDesk(['ARRIVE Ana', 'ARRIVE Ben', 'FRONT', 'SERVE']), ['Ana', 'Ana']);
test('serve through transfer', () => runTwoShelfDesk(['ARRIVE Ana', 'ARRIVE Ben', 'SERVE', 'ARRIVE Cam', 'SERVE', 'SERVE']), ['Ana', 'Ben', 'Cam']);
test('empty desk queries', () => runTwoShelfDesk(['FRONT', 'SERVE']), [null, null]);
test('front does not remove', () => runTwoShelfDesk(['ARRIVE Kai', 'FRONT', 'FRONT', 'SERVE']), ['Kai', 'Kai', 'Kai']);
test('interleaved arrivals', () => runTwoShelfDesk(['ARRIVE Lux', 'ARRIVE Nia', 'SERVE', 'ARRIVE Omar', 'FRONT', 'SERVE', 'SERVE']), ['Lux', 'Nia', 'Nia', 'Omar']);
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
