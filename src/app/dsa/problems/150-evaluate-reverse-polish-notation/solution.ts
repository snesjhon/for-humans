// =============================================================================
// Evaluate Reverse Polish Notation — Complete Solution
// =============================================================================

function evalRPN(tokens: string[]): number {
  const mixingBowls: number[] = [];
  const actionCards = new Set(['+', '-', '*', '/']);

  for (const token of tokens) {
    if (!actionCards.has(token)) {
      mixingBowls.push(Number(token)); // number tokens become prepared bowls on the counter
      continue;
    }

    const rightBowl = mixingBowls.pop()!; // the top bowl is the recipe's right operand
    const leftBowl = mixingBowls.pop()!; // the next bowl down is the left operand

    if (token === '+') {
      mixingBowls.push(leftBowl + rightBowl); // merge both bowls by addition
    } else if (token === '-') {
      mixingBowls.push(leftBowl - rightBowl); // subtraction must honor bowl order
    } else if (token === '*') {
      mixingBowls.push(leftBowl * rightBowl); // multiplication returns one combined bowl
    } else {
      mixingBowls.push(Math.trunc(leftBowl / rightBowl)); // divide and truncate toward zero
    }
  }

  return mixingBowls[mixingBowls.length - 1]; // one finished bowl remains at the end
}

// Tests — all must print PASS
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
