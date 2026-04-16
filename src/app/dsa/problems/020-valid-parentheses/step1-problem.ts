// Goal: Build the pile of still-open cases and enforce the "latest case closes
//       first" rule, without checking lid shape yet.

function isValid(s: string): boolean {
  throw new Error('not implemented');
}

runCase('empty log leaves no open cases', () => isValid(''), true);
runCase('simple round case closes cleanly', () => isValid('()'), true);
runCase('nested cases close in reverse order', () => isValid('([])'), true);
runCase('unfinished case remains open', () => isValid('('), false);
runCase('lid appears before any case is open', () => isValid(')('), false);

// ---Helpers
function runCase(desc: string, fn: () => unknown, expected: unknown): void {
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
