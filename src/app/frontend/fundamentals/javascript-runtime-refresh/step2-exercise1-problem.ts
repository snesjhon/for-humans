export {};
// Runtime Ledger, Level 2: Presence Semantics
// Fall back only when the delay is missing. A delay of 0 is valid.

// TODO: return delay when present, otherwise 1000.
function resolveRetryDelay(delay?: number | null): number {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

assert(resolveRetryDelay(250) === 250, 'keeps an explicit delay');
assert(resolveRetryDelay(0) === 0, 'keeps 0 instead of treating it as missing');
assert(resolveRetryDelay(undefined) === 1000, 'falls back for undefined');
assert(resolveRetryDelay(null) === 1000, 'falls back for null');
// ---End Tests
