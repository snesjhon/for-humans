export {};

// Status Lamps, Level 3: closed-set status tokens

type DeviceStatus = 'online' | 'offline' | 'alarm';

interface StatusTokens {
  background: string;
  foreground: string;
}

// TODO: return the token pair for each status.
// - online  => var(--status-online-bg),  var(--status-online-fg)
// - offline => var(--status-offline-bg), var(--status-offline-fg)
// - alarm   => var(--status-alarm-bg),   var(--status-alarm-fg)
function statusTokens(status: DeviceStatus): StatusTokens {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const online = statusTokens('online');
assert(online.background === 'var(--status-online-bg)', 'online background token is correct');
assert(online.foreground === 'var(--status-online-fg)', 'online foreground token is correct');

const alarm = statusTokens('alarm');
assert(alarm.background === 'var(--status-alarm-bg)', 'alarm background token is correct');
assert(alarm.foreground === 'var(--status-alarm-fg)', 'alarm foreground token is correct');
// ---End Tests
