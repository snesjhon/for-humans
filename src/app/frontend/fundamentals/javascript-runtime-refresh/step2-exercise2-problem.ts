export {};
// Runtime Ledger, Level 2: Presence Semantics
// Return true only for the exact number 0. Do not rely on coercion.

// TODO: reject values like '0' and false.
function isReadyCode(value: unknown): boolean {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

assert(isReadyCode(0) === true, 'the exact numeric code 0 is ready');
assert(isReadyCode('0') === false, 'string 0 does not count');
assert(isReadyCode(false) === false, 'boolean false does not count');
assert(isReadyCode(1) === false, 'other numbers do not count');
// ---End Tests
