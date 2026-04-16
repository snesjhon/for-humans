function restackPlates(plates: number[]): number[] {
  const shelf: number[] = [];
  for (const plate of plates) {
    shelf.push(plate);
  }

  const rebuilt: number[] = [];
  while (shelf.length > 0) {
    rebuilt.push(shelf.pop() as number);
  }
  return rebuilt;
}

// ---Tests
test('three plates', () => restackPlates([3, 1, 4]), [4, 1, 3]);
test('single plate', () => restackPlates([7]), [7]);
test('empty shelf', () => restackPlates([]), []);
test('repeated plates', () => restackPlates([2, 2, 2]), [2, 2, 2]);
test('descending shelf', () => restackPlates([5, 4, 3, 2]), [2, 3, 4, 5]);
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
