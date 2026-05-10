/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

type PanelState = 'closed' | 'device-2-entering' | 'device-2-settled' | 'device-2-exiting';

// Goal: panel motion should describe how the details rail is moving, not which device is selected.
function AnimatedDetailsPanel() {
  const [panelState, setPanelState] = useState<PanelState>('closed');

  return (
    <section>
      <button onClick={() => setPanelState('device-2-entering')}>Open Heat Sensor</button>
      <button onClick={() => setPanelState('device-2-settled')}>Mark settled</button>
      <button onClick={() => setPanelState('device-2-exiting')}>Close panel</button>

      {panelState === 'closed' ? (
        <p>Panel hidden</p>
      ) : panelState === 'device-2-entering' ? (
        <aside aria-label="Selected device panel" data-motion="entering">
          <h2>Heat Sensor</h2>
          <p>Panel phase: entering</p>
        </aside>
      ) : panelState === 'device-2-settled' ? (
        <aside aria-label="Selected device panel" data-motion="settled">
          <h2>Heat Sensor</h2>
          <p>Panel phase: settled</p>
        </aside>
      ) : (
        <p>Panel phase: exiting</p>
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
