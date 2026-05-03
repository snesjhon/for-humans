/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { useState } from 'react';

export type TrafficLightColor = 'green' | 'yellow' | 'red';

const LIGHTS: TrafficLightColor[] = ['green', 'yellow', 'red'];

// Goal: store the current traffic light as one state value, start on green, and derive which lamp is active during render.
export function TrafficLight() {
  return <div />;
}

// ---Tests
test('starts with green as the current light', () => {
  render(<TrafficLight />);

  expect(screen.getByText('current: green')).not.toBeNull();
});

test('only the green lamp is active in the first snapshot', () => {
  render(<TrafficLight />);

  expect(screen.getByText('green: active')).not.toBeNull();
  expect(screen.getByText('yellow: inactive')).not.toBeNull();
  expect(screen.getByText('red: inactive')).not.toBeNull();
});
// ---End Tests
