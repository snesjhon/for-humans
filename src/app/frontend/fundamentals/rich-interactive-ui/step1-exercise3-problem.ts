export {};

// Control-Room Wall, Level 1: opening a details panel without erasing data state

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

// TODO: open the given device without touching the request lane.
// - navigation should become { view: 'device', deviceId }
// - animation should become { panel: 'entering' }
function openDevicePanel(state: DashboardState, deviceId: string): DashboardState {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const base: DashboardState = {
  navigation: { view: 'overview' },
  request: { status: 'refreshing' },
  animation: { panel: 'hidden' },
};

const next = openDevicePanel(base, 'device-7');
assert(next.navigation.view === 'device', 'navigation switches to the device view');
assert(
  next.navigation.view === 'device' && next.navigation.deviceId === 'device-7',
  'device id is stored in the navigation lane',
);
assert(next.request.status === 'refreshing', 'request lane stays refreshing');
assert(next.animation.panel === 'entering', 'panel animation begins entering');
assert(base.navigation.view === 'overview', 'original navigation is unchanged');
// ---End Tests
