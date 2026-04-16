function serveTicketLine(events: string[]): string[] {
  const line: string[] = [];
  let front = 0;
  const served: string[] = [];

  for (const event of events) {
    if (event.startsWith('ARRIVE ')) {
      line.push(event.slice(7));
    } else if (event === 'SERVE' && front < line.length) {
      served.push(line[front]);
      front++;
    }
  }

  return served;
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
