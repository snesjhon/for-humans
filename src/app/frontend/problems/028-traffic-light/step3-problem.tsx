/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { act, useEffect, useState } from 'react';

export type TrafficLightColor = 'green' | 'yellow' | 'red';

const LIGHTS: TrafficLightColor[] = ['green', 'yellow', 'red'];
const DURATIONS: Record<TrafficLightColor, number> = {
  green: 3000,
  yellow: 500,
  red: 4000,
};

function getNextLight(currentLight: TrafficLightColor): TrafficLightColor {
  if (currentLight === 'green') return 'yellow';
  if (currentLight === 'yellow') return 'red';
  return 'green';
}

// Goal: return cleanup from the effect so unmounting mid-cycle clears the pending timeout instead of letting the old handoff survive in the background.
export function TrafficLight() {
  const [currentLight, setCurrentLight] = useState<TrafficLightColor>('green');

  useEffect(() => {
    window.setTimeout(() => {
      setCurrentLight(getNextLight(currentLight));
    }, DURATIONS[currentLight]);
  }, [currentLight]);

  return (
    <div>
      {LIGHTS.map((light) => (
        <p key={light}>
          {light}: {light === currentLight ? 'active' : 'inactive'}
        </p>
      ))}
      <p>current: {currentLight}</p>
    </div>
  );
}

// ---Tests
test('the cycle still loops through all three lights', () => {
  jest.useFakeTimers();
  render(<TrafficLight />);

  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(screen.getByText('current: yellow')).not.toBeNull();

  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(screen.getByText('current: red')).not.toBeNull();

  act(() => {
    jest.advanceTimersByTime(4000);
  });
  expect(screen.getByText('current: green')).not.toBeNull();
  jest.useRealTimers();
});

test('unmounting mid-cycle clears the pending timeout', () => {
  jest.useFakeTimers();
  const { unmount } = render(<TrafficLight />);

  expect(jest.getTimerCount()).toBe(1);

  act(() => {
    jest.advanceTimersByTime(1500);
  });
  act(() => {
    unmount();
  });

  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
// ---End Tests
