// Goal: When a lid appears, verify that it matches the newest unfinished case
//       before removing it from the pile.
//
// Step 1 (pile setup + opening-case push + empty-pile reject) is complete and
// locked below.

function isValid(s: string): boolean {
  const openCases: string[] = [];

  for (const mark of s) {
    if (mark === '(' || mark === '[' || mark === '{') {
      openCases.push(mark);
      continue;
    }

    if (openCases.length === 0) return false;

    throw new Error('not implemented');
  }

  return openCases.length === 0;
}

runCase('empty log leaves no open cases', () => isValid(''), true);
runCase('simple round case closes cleanly', () => isValid('()'), true);
runCase('nested cases close in reverse order', () => isValid('([])'), true);
runCase('unfinished case remains open', () => isValid('('), false);
runCase('lid appears before any case is open', () => isValid(')('), false);
runCase('mixed valid lids are accepted', () => isValid('()[]{}'), true);
runCase('wrong lid on top case is rejected', () => isValid('(]'), false);
runCase('balanced counts but crossed lids are rejected', () => isValid('([)]'), false);
runCase('fully nested mixed cases are valid', () => isValid('{[]}'), true);

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
