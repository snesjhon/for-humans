/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useState } from 'react';

export type Orientation = 'landscape' | 'portrait';

export type WindowDimensions = {
  width: number;
  height: number;
  orientation: Orientation;
};

// Goal: read window.innerWidth and window.innerHeight into state, then derive orientation in the return expression.
export function useWindowDimensions(): WindowDimensions {
  const [width] = useState(window.innerWidth);
  const [height] = useState(window.innerHeight);

  return {
    width,
    height,
    orientation: width > height ? 'landscape' : 'portrait',
  };
}

// ---Tests
test('returns the current window width and height', () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1200,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 800,
  });

  const { result } = renderHook(() => useWindowDimensions());

  expect(result.current.width).toBe(1200);
  expect(result.current.height).toBe(800);
});

test('returns landscape when width exceeds height', () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1200,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 800,
  });

  const { result } = renderHook(() => useWindowDimensions());

  expect(result.current.orientation).toBe('landscape');
});

test('returns portrait when height exceeds width', () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 390,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 844,
  });

  const { result } = renderHook(() => useWindowDimensions());

  expect(result.current.orientation).toBe('portrait');
});
// ---End Tests
