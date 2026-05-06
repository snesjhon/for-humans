export {};
// Runtime Ledger, Level 3: In-Place Change And Queue Order
// sort() mutates the original array, so make a fresh copy before sorting.

// TODO: return scores sorted from highest to lowest without mutating the input.
function sortScoresDescending(scores: number[]): number[] {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const originalScores = [30, 10, 20];
const sorted = sortScoresDescending(originalScores);

assert(sorted[0] === 30 && sorted[1] === 20 && sorted[2] === 10, 'scores are sorted descending');
assert(originalScores[0] === 30 && originalScores[1] === 10 && originalScores[2] === 20, 'original array order stays unchanged');
assert(sorted !== originalScores, 'result is a new array reference');
// ---End Tests
