// Goal: Set up the writing hand at position 1, since the first book is always
//       the first unique title in the curated section.

function removeDuplicates(nums: number[]): number {
  // Writing hand starts at 1 — the first book is already in the curated section
  let k = 1;

  return k;
}

// ---Tests
test('single element stays', () => removeDuplicates([1]), 1);
test('writing hand starts at 1', () => removeDuplicates([5]), 1);
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
