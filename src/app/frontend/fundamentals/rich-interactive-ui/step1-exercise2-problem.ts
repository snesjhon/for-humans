export {};

// Control-Room Wall, Level 1: background refresh without resetting navigation

type DashboardState = {
  navigation:
    | { view: 'overview' }
    | { view: 'device'; deviceId: string };
  request:
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ready' }
    | { status: 'refreshing' };
  animation:
    | { panel: 'hidden' }
    | { panel: 'entering' }
    | { panel: 'settled' }
    | { panel: 'leaving' };
};

// TODO: return a new state where only request becomes { status: 'refreshing' }.
// Keep navigation and animation exactly as they were.
function startRefresh(state: DashboardState): DashboardState {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const original: DashboardState = {
  navigation: { view: 'device', deviceId: 'device-42' },
  request: { status: 'ready' },
  animation: { panel: 'settled' },
};

const refreshed = startRefresh(original);
assert(refreshed.request.status === 'refreshing', 'request lane becomes refreshing');
assert(refreshed.navigation.view === 'device', 'navigation lane stays on the device view');
assert(
  refreshed.navigation.view === 'device' && refreshed.navigation.deviceId === 'device-42',
  'selected device survives the refresh',
);
assert(refreshed.animation.panel === 'settled', 'animation lane stays settled');
assert(original.request.status === 'ready', 'original state is not mutated');
// ---End Tests
