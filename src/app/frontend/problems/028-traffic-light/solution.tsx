/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { useEffect, useState } from 'react';

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

// Goal: model the traffic light as one current state, schedule one effect-owned timeout for the next handoff, and clear that timeout on cleanup so unmount stops the cycle.
export function TrafficLight() {
  const [currentLight, setCurrentLight] = useState<TrafficLightColor>('green');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentLight(getNextLight(currentLight));
    }, DURATIONS[currentLight]);

    return () => window.clearTimeout(timeoutId);
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
test('starts on green', () => {
  render(<TrafficLight />);

  expect(screen.getByText('current: green')).not.toBeNull();
  expect(screen.getByText('green: active')).not.toBeNull();
});

test('cycles from green to yellow to red and back to green', () => {
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
    jest.advanceTimersByTime(2500);
  });
  act(() => {
    unmount();
  });

  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
// ---End Tests
