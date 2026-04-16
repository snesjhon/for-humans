// Goal: Teach the host to combine the top two bowls in left-right order and
//       return one replacement bowl to the counter.

function evalRPN(tokens: string[]): number {
  const mixingBowls: number[] = [];
  const actionCards = new Set(['+', '-', '*', '/']);

  for (const token of tokens) {
    if (!actionCards.has(token)) {
      mixingBowls.push(Number(token)); // number tokens arrive as prepared bowls
      continue;
    }

    const rightBowl = mixingBowls.pop()!; // the latest bowl is the recipe's right side
    const leftBowl = mixingBowls.pop()!; // the bowl beneath it is the left side

    if (token === '+') {
      mixingBowls.push(leftBowl + rightBowl); // add both bowls into one mixture
    } else if (token === '-') {
      mixingBowls.push(leftBowl - rightBowl); // preserve left-right subtraction order
    } else if (token === '*') {
      mixingBowls.push(leftBowl * rightBowl); // multiply the two lifted bowls
    } else {
      mixingBowls.push(Math.trunc(leftBowl / rightBowl)); // division truncates toward zero
    }
  }

  return mixingBowls[mixingBowls.length - 1]; // the final bowl is the completed dish
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
