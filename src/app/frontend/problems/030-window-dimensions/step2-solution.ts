/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useEffect, useState } from 'react';

export type Orientation = 'landscape' | 'portrait';

export type WindowDimensions = {
  width: number;
  height: number;
  orientation: Orientation;
};

// Goal: add a resize listener that updates stored dimensions when the window resizes, and remove it when the component unmounts.
export function useWindowDimensions(): WindowDimensions {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    height,
    orientation: width > height ? 'landscape' : 'portrait',
  };
}

// ---Tests
test('updates width and height after a resize event', () => {
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

  act(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 900,
    });
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current.width).toBe(400);
  expect(result.current.height).toBe(900);
});

test('updates orientation to portrait after resizing to a tall window', () => {
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

  act(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 900,
    });
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current.orientation).toBe('portrait');
});
// ---End Tests
