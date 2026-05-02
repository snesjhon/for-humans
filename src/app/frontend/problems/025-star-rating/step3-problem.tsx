/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

export type StarRatingProps = {
  maxStars: number;
  initialFilledStars: number;
};

function buildStarValues(maxStars: number): number[] {
  return Array.from({ length: maxStars }, (_, index) => index + 1);
}

// Goal: add a separate hover-preview lane, wire the pointer events that control it, and let render choose the preview value over the saved rating only while the pointer is active.
export function StarRating({
  maxStars,
  initialFilledStars,
}: StarRatingProps) {
  const [selectedRating, setSelectedRating] = useState(initialFilledStars);

  return (
    <div>
      {buildStarValues(maxStars).map((ratingValue) => {
        const isFilled = ratingValue <= selectedRating;

        return (
          <button
            key={ratingValue}
            type="button"
            onClick={() => setSelectedRating(ratingValue)}
          >
            {isFilled ? 'filled' : 'empty'}
          </button>
        );
      })}
    </div>
  );
}

// ---Tests
test('hovered stars temporarily take priority over the saved selection', () => {
  render(<StarRating maxStars={5} initialFilledStars={4} />);

  fireEvent.mouseEnter(screen.getAllByRole('button')[1]);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled');
  expect(buttons[1].textContent).toBe('filled');
  expect(buttons[2].textContent).toBe('empty');
  expect(buttons[3].textContent).toBe('empty');
});

test('leaving without clicking should restore the saved selection', () => {
  render(<StarRating maxStars={5} initialFilledStars={4} />);

  const secondStar = screen.getAllByRole('button')[1];
  fireEvent.mouseEnter(secondStar);
  fireEvent.mouseLeave(secondStar);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled');
  expect(buttons[1].textContent).toBe('filled');
  expect(buttons[2].textContent).toBe('filled');
  expect(buttons[3].textContent).toBe('filled');
  expect(buttons[4].textContent).toBe('empty');
});
// ---End Tests
