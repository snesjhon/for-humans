/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

type MotionPhase = 'idle' | 'entering' | 'settled' | 'exiting';

// Goal: panel motion should describe how the details rail is moving, not which device is selected.
function AnimatedDetailsPanel() {
  const [selectedDeviceName, setSelectedDeviceName] = useState<string | null>(null);
  const [motionPhase, setMotionPhase] = useState<MotionPhase>('idle');

  function openHeatSensor() {
    setSelectedDeviceName('Heat Sensor');
    setMotionPhase('entering');
  }

  return (
    <section>
      <button onClick={openHeatSensor}>Open Heat Sensor</button>
      <button onClick={() => setMotionPhase('settled')}>Mark settled</button>
      <button onClick={() => setMotionPhase('exiting')}>Close panel</button>

      {selectedDeviceName ? (
        <aside aria-label="Selected device panel" data-motion={motionPhase}>
          <h2>{selectedDeviceName}</h2>
          <p>Panel phase: {motionPhase}</p>
        </aside>
      ) : (
        <p>Panel hidden</p>
      )}
    </section>
  );
}

test('settling the panel keeps the selected device visible', () => {
  render(<AnimatedDetailsPanel />);

  fireEvent.click(screen.getByRole('button', { name: 'Open Heat Sensor' }));
  expect(screen.getByRole('heading', { name: 'Heat Sensor' })).not.toBeNull();
  expect(screen.getByText('Panel phase: entering')).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Mark settled' }));

  expect(screen.getByRole('heading', { name: 'Heat Sensor' })).not.toBeNull();
  expect(screen.getByText('Panel phase: settled')).not.toBeNull();
  expect(screen.getByLabelText('Selected device panel').getAttribute('data-motion')).toBe('settled');
});

test('closing the panel still shows which device is exiting', () => {
  render(<AnimatedDetailsPanel />);

  fireEvent.click(screen.getByRole('button', { name: 'Open Heat Sensor' }));
  fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));

  expect(screen.getByText('Panel phase: exiting')).not.toBeNull();
  expect(screen.getByText('Heat Sensor')).not.toBeNull();
});
