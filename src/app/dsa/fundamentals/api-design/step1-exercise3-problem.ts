// Goal: Implement a FrequencyStack where popMax() removes the most recently pushed
//       element among those with the highest frequency. All operations O(1).
//
// push(val): push val onto the stack
// popMax(): remove and return the most recently pushed element with the current max frequency
//
// Shadow state: a frequency map and a map from frequency to a stack of values at that freq.
// The invariant: maxFreq always holds the current highest frequency in the structure.
//
// Example:
//   push(5), push(7), push(5), push(7), push(4), push(5)
//   popMax() -> 5  (freq 3, most recent at that freq)
//   popMax() -> 7  (freq 2 now highest, most recent 7)
//   popMax() -> 5  (freq 2 still, most recent 5)
class FrequencyStack {
  private freq: Map<number, number> = new Map();
  private group: Map<number, number[]> = new Map();
  private maxFreq: number = 0;

  push(val: number): void {
    // TODO:
    // 1. Increment freq[val]
    // 2. Update maxFreq if the new frequency is higher
    // 3. Add val to group[newFreq]
    throw new Error('not implemented');
  }

  popMax(): number {
    // TODO:
    // 1. Get the stack at group[maxFreq] and pop from it
    // 2. If that stack is now empty, decrement maxFreq
    // 3. Decrement freq[val]
    // 4. Return val
    throw new Error('not implemented');
  }
}

// ---Tests
test('popMax returns the only element', () => {
  const s = new FrequencyStack();
  s.push(1);
  return s.popMax();
}, 1);

test('popMax returns most frequent', () => {
  const s = new FrequencyStack();
  s.push(5);
  s.push(7);
  s.push(5);
  return s.popMax();
}, 5);

test('popMax on tie returns most recently pushed at that frequency', () => {
  const s = new FrequencyStack();
  s.push(5);
  s.push(7);
  s.push(5);
  s.push(7);
  return s.popMax(); // both have freq 2; 7 was most recently pushed at freq 2
}, 7);

test('maxFreq decrements when the top frequency group empties', () => {
  const s = new FrequencyStack();
  s.push(5);
  s.push(7);
  s.push(5);
  s.push(7);
  s.popMax(); // removes 7 (freq 2 group now has only 5)
  s.popMax(); // removes 5 (freq 2 group now empty, maxFreq drops to 1)
  return s.popMax(); // freq 1 group: 7 was pushed before 5, so returns 7
}, 7);

test('sequence from the doc example', () => {
  const s = new FrequencyStack();
  s.push(5); s.push(7); s.push(5); s.push(7); s.push(4); s.push(5);
  return [s.popMax(), s.popMax(), s.popMax()];
}, [5, 7, 5]);
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
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers

export {};
