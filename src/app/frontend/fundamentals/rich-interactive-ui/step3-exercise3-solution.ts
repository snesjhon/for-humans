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

function visibleLayers(state: DashboardState): string[] {
  if (state.request.status === 'loading') {
    return ['loading-screen'];
  }

  const layers = ['device-grid'];

  if (state.request.status === 'refreshing') {
    layers.push('refresh-spinner');
  }

  if (state.navigation.view === 'device') {
    layers.push(`details:${state.navigation.deviceId}`);

    if (state.animation.panel !== 'hidden') {
      layers.push(`panel-motion:${state.animation.panel}`);
    }
  }

  return layers;
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
