/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

type Panel = 'overview' | 'devices' | 'alerts';

// Goal: a background refresh should layer on top of the current panel, not replace it.
function DashboardScreen() {
  const [screen, setScreen] = useState<Panel | 'refreshing'>('overview');

  function showPanel(panel: Panel) {
    setScreen(panel);
  }

  function startRefresh() {
    setScreen('refreshing');
  }

  return (
    <section>
      <div>
        <button onClick={() => showPanel('overview')}>Overview</button>
        <button onClick={() => showPanel('devices')}>Devices</button>
        <button onClick={() => showPanel('alerts')}>Alerts</button>
        <button onClick={startRefresh}>Refresh data</button>
      </div>

      {screen === 'refreshing' ? (
        <p>Refreshing dashboard...</p>
      ) : (
        <>
          <h1>{screen} panel</h1>
          <p>Current screen: {screen}</p>
        </>
      )}
    </section>
  );
}

test('refresh keeps the current panel visible while showing a refresh indicator', () => {
  render(<DashboardScreen />);

  fireEvent.click(screen.getByRole('button', { name: 'Devices' }));
  expect(screen.getByRole('heading', { name: 'devices panel' })).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Refresh data' }));

  expect(screen.getByRole('heading', { name: 'devices panel' })).not.toBeNull();
  expect(screen.getByText('Refreshing dashboard...')).not.toBeNull();
  expect(screen.getByText('Current screen: devices')).not.toBeNull();
});

test('refreshing the alerts panel does not fall back to another screen', () => {
  render(<DashboardScreen />);

  fireEvent.click(screen.getByRole('button', { name: 'Alerts' }));
  fireEvent.click(screen.getByRole('button', { name: 'Refresh data' }));

  expect(screen.getByRole('heading', { name: 'alerts panel' })).not.toBeNull();
  expect(screen.queryByRole('heading', { name: 'overview panel' })).toBeNull();
});
