export {};

// Status Lamps, Level 3: read the visible UI layers from independent lanes

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

// TODO: return the visible dashboard layers in reading order.
// Rules:
// - loading     => ['loading-screen']
// - ready/refreshing always show ['device-grid']
// - refreshing adds 'refresh-spinner'
// - navigation device adds `details:${deviceId}`
// - entering/settled/leaving with a device view also add `panel-motion:${panel}`
function visibleLayers(state: DashboardState): string[] {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const refreshingPanel = visibleLayers({
  navigation: { view: 'device', deviceId: 'device-9' },
  request: { status: 'refreshing' },
  animation: { panel: 'entering' },
});

assert(refreshingPanel[0] === 'device-grid', 'ready-like data states keep the grid visible');
assert(refreshingPanel.includes('refresh-spinner'), 'refreshing adds a spinner overlay');
assert(refreshingPanel.includes('details:device-9'), 'selected device adds a details layer');
assert(refreshingPanel.includes('panel-motion:entering'), 'panel motion is represented separately');

const coldLoad = visibleLayers({
  navigation: { view: 'overview' },
  request: { status: 'loading' },
  animation: { panel: 'hidden' },
});

assert(coldLoad.length === 1 && coldLoad[0] === 'loading-screen', 'initial loading replaces the grid');
// ---End Tests
