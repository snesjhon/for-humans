/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { act, useState } from 'react';

export type TrafficLightColor = 'green' | 'yellow' | 'red';

const LIGHTS: TrafficLightColor[] = ['green', 'yellow', 'red'];

// Goal: schedule one timeout from the current light so the component advances through green, yellow, red, and back to green using the per-light durations.
export function TrafficLight() {
  const [currentLight] = useState<TrafficLightColor>('green');

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
test('green changes to yellow after the green duration', () => {
  jest.useFakeTimers();
  render(<TrafficLight />);

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(screen.getByText('current: yellow')).not.toBeNull();
  jest.useRealTimers();
});

test('the cycle continues from yellow to red to green', () => {
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
// ---End Tests
