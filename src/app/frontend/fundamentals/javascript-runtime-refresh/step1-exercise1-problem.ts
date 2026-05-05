export {};
// Runtime Ledger, Level 1: Shared Identity
// Return a new tags array that includes the new tag without mutating the input array.

// TODO: append tag to a fresh array and return it.
function appendTag(tags: string[], nextTag: string): string[] {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const original = ['react', 'state'];
const result = appendTag(original, 'effects');

assert(result.length === 3, 'result includes the new tag');
assert(result[2] === 'effects', 'new tag is appended at the end');
assert(original.length === 2, 'original array stays unchanged');
assert(original !== result, 'result is a new array reference');
// ---End Tests
