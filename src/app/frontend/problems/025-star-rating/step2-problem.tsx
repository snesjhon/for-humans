/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

export type StarRatingProps = {
  maxStars: number;
  initialFilledStars: number;
};

function buildStarValues(maxStars: number): number[] {
  return Array.from({ length: maxStars }, (_, index) => index + 1);
}

// Goal: introduce one piece of state for the user's committed rating, then use that single value to drive which stars render as filled after a click.
export function StarRating({
  maxStars,
  initialFilledStars,
}: StarRatingProps) {
  return (
    <div>
      {buildStarValues(maxStars).map((ratingValue) => {
        const isFilled = ratingValue <= initialFilledStars;

        return (
          <button key={ratingValue} type="button">
            {isFilled ? 'filled' : 'empty'}
          </button>
        );
      })}
    </div>
  );
}

// ---Tests
test('clicking a star fills that star and all stars to its left', () => {
  render(<StarRating maxStars={5} initialFilledStars={0} />);

  fireEvent.click(screen.getAllByRole('button')[3]);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled');
  expect(buttons[1].textContent).toBe('filled');
  expect(buttons[2].textContent).toBe('filled');
  expect(buttons[3].textContent).toBe('filled');
  expect(buttons[4].textContent).toBe('empty');
});

test('clicking a lower star should replace the previous selection', () => {
  render(<StarRating maxStars={5} initialFilledStars={4} />);

  fireEvent.click(screen.getAllByRole('button')[1]);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled');
  expect(buttons[1].textContent).toBe('filled');
  expect(buttons[2].textContent).toBe('empty');
  expect(buttons[3].textContent).toBe('empty');
  expect(buttons[4].textContent).toBe('empty');
});
// ---End Tests
