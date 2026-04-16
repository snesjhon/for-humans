function reportLowestPlate(events: string[]): number[] {
  const shelf: number[] = [];
  const mins: number[] = [];
  const answer: number[] = [];

  for (const event of events) {
    if (event.startsWith('DROP ')) {
      const plate = Number(event.slice(5));
      shelf.push(plate);
      mins.push(mins.length === 0 ? plate : Math.min(plate, mins[mins.length - 1]));
    } else if (event === 'LIFT') {
      if (shelf.length > 0) {
        shelf.pop();
        mins.pop();
      }
    } else if (event === 'MIN') {
      answer.push(mins.length === 0 ? -1 : mins[mins.length - 1]);
    }
  }

  return answer;
}

// ---Tests
test('drop, query, lift, query', () => reportLowestPlate(['DROP 5', 'DROP 3', 'MIN', 'LIFT', 'MIN']), [3, 5]);
test('empty min query', () => reportLowestPlate(['MIN']), [-1]);
test('repeated minima', () => reportLowestPlate(['DROP 4', 'DROP 4', 'MIN', 'LIFT', 'MIN']), [4, 4]);
test('lift empty shelf', () => reportLowestPlate(['LIFT', 'DROP 9', 'MIN']), [9]);
test('many updates', () => reportLowestPlate(['DROP 8', 'DROP 6', 'DROP 7', 'MIN', 'LIFT', 'MIN', 'DROP 5', 'MIN']), [6, 6, 5]);
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
