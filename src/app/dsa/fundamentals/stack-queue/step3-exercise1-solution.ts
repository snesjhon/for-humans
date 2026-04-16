function daysUntilTallerBuilding(heights: number[]): number[] {
  const answer = new Array(heights.length).fill(0);
  const stack: number[] = [];

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const j = stack.pop() as number;
      answer[j] = i - j;
    }
    stack.push(i);
  }

  return answer;
}

// ---Tests
test('mixed skyline', () => daysUntilTallerBuilding([3, 1, 4, 2]), [2, 1, 0, 0]);
test('strictly rising', () => daysUntilTallerBuilding([1, 2, 3, 4]), [1, 1, 1, 0]);
test('strictly falling', () => daysUntilTallerBuilding([4, 3, 2, 1]), [0, 0, 0, 0]);
test('plateau then rise', () => daysUntilTallerBuilding([2, 2, 3]), [2, 1, 0]);
test('single building', () => daysUntilTallerBuilding([9]), [0]);
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
