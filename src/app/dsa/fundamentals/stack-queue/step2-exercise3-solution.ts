function runTwoShelfDesk(events: string[]): Array<string | null> {
  const arrivalShelf: string[] = [];
  const serviceShelf: string[] = [];
  const answer: Array<string | null> = [];

  for (const event of events) {
    if (event.startsWith('ARRIVE ')) {
      arrivalShelf.push(event.slice(7));
    } else if (event === 'FRONT') {
      if (serviceShelf.length === 0) {
        while (arrivalShelf.length > 0) {
          serviceShelf.push(arrivalShelf.pop() as string);
        }
      }
      answer.push(serviceShelf.length === 0 ? null : serviceShelf[serviceShelf.length - 1]);
    } else if (event === 'SERVE') {
      if (serviceShelf.length === 0) {
        while (arrivalShelf.length > 0) {
          serviceShelf.push(arrivalShelf.pop() as string);
        }
      }
      answer.push(serviceShelf.length === 0 ? null : serviceShelf.pop() as string);
    }
  }

  return answer;
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
