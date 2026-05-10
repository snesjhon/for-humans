/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const DEVICES = [
  { id: 'device-1', name: 'Mixer Pump' },
  { id: 'device-2', name: 'Heat Sensor' },
];

// Goal: selection and refreshing should coexist in the rendered UI.
function DeviceWorkspace() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  function startRefresh() {
    setIsRefreshing(true);
    setSelectedDeviceId(null);
  }

  const selectedDevice = DEVICES.find((device) => device.id === selectedDeviceId) ?? null;

  return (
    <section>
      <button onClick={startRefresh}>Refresh devices</button>
      {isRefreshing ? <p>Refreshing device data...</p> : null}

      <ul>
        {DEVICES.map((device) => (
          <li key={device.id}>
            <button onClick={() => setSelectedDeviceId(device.id)}>{device.name}</button>
          </li>
        ))}
      </ul>

      <aside aria-label="Device details">
        {selectedDevice ? (
          <>
            <h2>{selectedDevice.name}</h2>
            <p>Showing details for {selectedDevice.id}</p>
          </>
        ) : (
          <p>No device selected</p>
        )}
      </aside>
    </section>
  );
}

test('refresh keeps the selected device details visible', () => {
  render(<DeviceWorkspace />);

  fireEvent.click(screen.getByRole('button', { name: 'Heat Sensor' }));
  expect(screen.getByRole('heading', { name: 'Heat Sensor' })).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Refresh devices' }));

  expect(screen.getByRole('heading', { name: 'Heat Sensor' })).not.toBeNull();
  expect(screen.getByText('Showing details for device-2')).not.toBeNull();
  expect(screen.getByText('Refreshing device data...')).not.toBeNull();
});

test('refresh does not replace the details rail with the empty state', () => {
  render(<DeviceWorkspace />);

  fireEvent.click(screen.getByRole('button', { name: 'Mixer Pump' }));
  fireEvent.click(screen.getByRole('button', { name: 'Refresh devices' }));

  expect(screen.queryByText('No device selected')).toBeNull();
});
