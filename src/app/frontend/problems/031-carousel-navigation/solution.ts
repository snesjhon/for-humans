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

export function useCarousel(): CarouselView {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function handleScroll(event: ScrollEvent) {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const leftOffset  = scrollLeft;
    const rightOffset = scrollWidth - clientWidth - scrollLeft;
    setCanScrollLeft(leftOffset > 0);
    setCanScrollRight(rightOffset > 0);
  }

  return { canScrollLeft, canScrollRight, handleScroll };
}

// ---Tests
test('at the start, rightOffset is at its maximum so the right arrow is visible', () => {
  const { result } = renderHook(() => useCarousel());

  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 0, scrollWidth: 500, clientWidth: 200 },
    });
  });

  expect(result.current.canScrollLeft).toBe(false);
  expect(result.current.canScrollRight).toBe(true);
});

test('in the middle, both offsets are greater than zero so both arrows are visible', () => {
  const { result } = renderHook(() => useCarousel());

  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 150, scrollWidth: 500, clientWidth: 200 },
    });
  });

  expect(result.current.canScrollLeft).toBe(true);
  expect(result.current.canScrollRight).toBe(true);
});

test('at the end, rightOffset is zero so the right arrow is hidden', () => {
  const { result } = renderHook(() => useCarousel());

  act(() => {
    result.current.handleScroll({
      target: { scrollLeft: 300, scrollWidth: 500, clientWidth: 200 },
    });
  });

  expect(result.current.canScrollLeft).toBe(true);
  expect(result.current.canScrollRight).toBe(false);
});
// ---End Tests
