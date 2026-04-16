// Goal: Teach the host to combine the top two bowls in left-right order and
//       return one replacement bowl to the counter.
//
// Prior steps are complete and locked inside the function body.

function evalRPN(tokens: string[]): number {
  const mixingBowls: number[] = [];
  const actionCards = new Set(['+', '-', '*', '/']);

  for (const token of tokens) {
    if (!actionCards.has(token)) {
      mixingBowls.push(Number(token)); // Step 1: stack each prepared bowl
      continue;
    }

    throw new Error('not implemented');
  }

  return mixingBowls[mixingBowls.length - 1];
}

runCase('example 1', () => evalRPN(['2', '1', '+', '3', '*']), 9);
runCase('example 2', () => evalRPN(['4', '13', '5', '/', '+']), 6);
runCase('subtraction respects left and right bowls', () => evalRPN(['5', '3', '-']), 2);
runCase('negative division truncates toward zero', () => evalRPN(['-7', '2', '/']), -3);
runCase(
  'example 3',
  () => evalRPN(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']),
  22,
);

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
