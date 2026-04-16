// =============================================================================
// Valid Parentheses — Complete Solution
// =============================================================================

function isValid(s: string): boolean {
  const openCases: string[] = [];
  const matchingLid: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  for (const mark of s) {
    if (mark === '(' || mark === '[' || mark === '{') {
      openCases.push(mark); // open a new storage case and place it on the pile
      continue;
    }

    if (openCases.length === 0) return false; // no case is available for this lid

    const latestCase = openCases.pop()!; // only the top unfinished case may close now
    if (matchingLid[latestCase] !== mark) return false; // the arriving lid must fit
  }

  return openCases.length === 0; // valid means the warehouse pile is fully sealed
}

// Tests — all must print PASS
runCase('single pair', () => isValid('()'), true);
runCase('multiple independent pairs', () => isValid('()[]{}'), true);
runCase('wrong lid type', () => isValid('(]'), false);
runCase('crossed nesting order', () => isValid('([)]'), false);
runCase('nested mixed lids', () => isValid('{[]}'), true);
runCase('unfinished opening case', () => isValid('(('), false);
runCase('closing without opening', () => isValid(']'), false);
runCase('deeply nested valid chain', () => isValid('([{}])'), true);
runCase('empty string', () => isValid(''), true);

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
