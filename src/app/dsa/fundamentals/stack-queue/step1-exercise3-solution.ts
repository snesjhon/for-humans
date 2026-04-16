function undoPlateLabels(note: string): string {
  const stack: string[] = [];
  for (const char of note) {
    if (char === '#') {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(char);
    }
  }
  return stack.join('');
}

// ---Tests
test('simple erase', () => undoPlateLabels('ab#c'), 'ac');
test('two erases', () => undoPlateLabels('room##'), 'ro');
test('erase everything', () => undoPlateLabels('abc###'), '');
test('erase on empty', () => undoPlateLabels('##a'), 'a');
test('no erases', () => undoPlateLabels('stack'), 'stack');
test('mixed', () => undoPlateLabels('a#bc##d'), 'd');
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
