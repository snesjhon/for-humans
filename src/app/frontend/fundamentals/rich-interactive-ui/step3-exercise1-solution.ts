export {};

// Status Lamps, Level 3: closed-set status tokens

type DeviceStatus = 'online' | 'offline' | 'alarm';

interface StatusTokens {
  background: string;
  foreground: string;
}

function statusTokens(status: DeviceStatus): StatusTokens {
  switch (status) {
    case 'online':
      return {
        background: 'var(--status-online-bg)',
        foreground: 'var(--status-online-fg)',
      };
    case 'offline':
      return {
        background: 'var(--status-offline-bg)',
        foreground: 'var(--status-offline-fg)',
      };
    case 'alarm':
      return {
        background: 'var(--status-alarm-bg)',
        foreground: 'var(--status-alarm-fg)',
      };
  }
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
