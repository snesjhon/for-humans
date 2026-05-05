export {};
// Runtime Ledger, Level 2: Presence Semantics
// Return false only when the value is actually missing.

function hasProvidedValue(value: unknown): boolean {
  return value !== null && value !== undefined;
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

assert(hasProvidedValue(0) === true, '0 is present');
assert(hasProvidedValue(false) === true, 'false is present');
assert(hasProvidedValue('') === true, 'empty string is present');
assert(hasProvidedValue(null) === false, 'null is missing');
assert(hasProvidedValue(undefined) === false, 'undefined is missing');
// ---End Tests
