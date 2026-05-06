export {};
// Runtime Ledger, Level 3: In-Place Change And Queue Order
// Append a message without mutating the existing log.

// TODO: return a new log array with the message appended.
function appendMessage(log: string[], message: string): string[] {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const originalLog = ['mount', 'render'];
const nextLog = appendMessage(originalLog, 'commit');

assert(nextLog.length === 3, 'result has the new message');
assert(nextLog[2] === 'commit', 'message is appended');
assert(originalLog.length === 2, 'original log stays unchanged');
assert(nextLog !== originalLog, 'result is a new array reference');
// ---End Tests
