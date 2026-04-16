// Goal: Build the counter of prepared bowls so every number token lands on top
//       of the stack in arrival order.

function evalRPN(tokens: string[]): number {
  const mixingBowls: number[] = [];

  for (const token of tokens) {
    mixingBowls.push(Number(token)); // every token in this step is a prepared bowl
  }

  return mixingBowls[mixingBowls.length - 1]; // the top bowl is the current answer
}

runCase('single bowl stays as the answer', () => evalRPN(['7']), 7);
runCase('negative bowl is still just a number token', () => evalRPN(['-11']), -11);
runCase('zero bowl returns zero', () => evalRPN(['0']), 0);

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
