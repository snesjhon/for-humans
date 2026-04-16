// Goal: Build the pile of still-open cases and enforce the "latest case closes
//       first" rule, without checking lid shape yet.

function isValid(s: string): boolean {
  const openCases: string[] = [];

  for (const mark of s) {
    if (mark === '(' || mark === '[' || mark === '{') {
      openCases.push(mark); // a newly opened case becomes the active top case
      continue;
    }

    if (openCases.length === 0) return false; // a lid arrived with no case to seal
    openCases.pop(); // step 1 only teaches "latest case closes first"
  }

  return openCases.length === 0; // no unfinished cases can remain on the pile
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
