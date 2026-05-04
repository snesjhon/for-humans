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

// Goal: store two browser facts, keep them synchronized through an effect + listener + cleanup pair, and derive orientation from them.
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
test('returns initial width and height from the browser', () => {
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
  expect(result.current.orientation).toBe('landscape');
});

test('updates all fields after a resize event', () => {
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
  expect(result.current.orientation).toBe('portrait');
});

test('removes the resize listener on unmount', () => {
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

  const { result, unmount } = renderHook(() => useWindowDimensions());

  unmount();

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

  expect(result.current.width).toBe(1200);
  expect(result.current.height).toBe(800);
});
// ---End Tests
