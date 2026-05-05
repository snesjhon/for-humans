/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';

type ScrollTarget = Pick<HTMLElement, 'scrollLeft' | 'scrollWidth' | 'clientWidth'>;
type ScrollEvent = { target: ScrollTarget };

export type CarouselView = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  handleScroll: (event: ScrollEvent) => void;
};

// Goal: compute leftOffset from the scroll event target and use it to derive canScrollLeft.
export function useCarousel(): CarouselView {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function handleScroll(_event: ScrollEvent) {
    setCanScrollLeft(false);
    setCanScrollRight(true);
  }

  return { canScrollLeft, canScrollRight, handleScroll };
}

// ---Tests
test('canScrollLeft is false when leftOffset is zero', () => {
  const { result } = renderHook(() => useCarousel());

  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 0, scrollWidth: 500, clientWidth: 200 },
    });
  });

  expect(result.current.canScrollLeft).toBe(false);
});

test('canScrollLeft is true when leftOffset is greater than zero', () => {
  const { result } = renderHook(() => useCarousel());

  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 100, scrollWidth: 500, clientWidth: 200 },
    });
  });

  expect(result.current.canScrollLeft).toBe(true);
});

test('canScrollLeft returns to false when scrolled back to the start', () => {
  const { result } = renderHook(() => useCarousel());

  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 100, scrollWidth: 500, clientWidth: 200 },
    });
  });
  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 0, scrollWidth: 500, clientWidth: 200 },
    });
  });

  expect(result.current.canScrollLeft).toBe(false);
});
// ---End Tests
