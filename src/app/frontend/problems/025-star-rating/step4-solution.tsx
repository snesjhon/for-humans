/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Fragment, useState } from 'react';

export type StarRatingProps = {
  maxStars: number;
  initialFilledStars: number;
};

function buildStarValues(maxStars: number): number[] {
  return Array.from({ length: maxStars }, (_, index) => index + 1);
}

// Goal: when the pointer leaves without a new click, restore the previously selected filled state, and keep each StarRating instance independent when multiple widgets render on the same page.
export function StarRating({
  maxStars,
  initialFilledStars,
}: StarRatingProps) {
  const [selectedRating, setSelectedRating] = useState(initialFilledStars);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const displayRating = hoveredRating ?? selectedRating;

  return (
    <div role="group">
      {buildStarValues(maxStars).map((ratingValue) => {
        const isFilled = ratingValue <= displayRating;

        return (
          <button
            key={ratingValue}
            type="button"
            onClick={() => setSelectedRating(ratingValue)}
            onMouseEnter={() => setHoveredRating(ratingValue)}
            onMouseLeave={() => setHoveredRating(null)}
          >
            {isFilled ? 'filled' : 'empty'}
          </button>
        );
      })}
    </div>
  );
}

// ---Tests
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

test('different StarRating instances keep their own local state', () => {
  render(
    <Fragment>
      <StarRating maxStars={5} initialFilledStars={1} />
      <StarRating maxStars={3} initialFilledStars={0} />
    </Fragment>,
  );

  const groups = screen.getAllByRole('group');
  const firstButtons = within(groups[0]).getAllByRole('button');
  const secondButtons = within(groups[1]).getAllByRole('button');

  fireEvent.click(within(groups[1]).getAllByRole('button')[2]);

  expect(firstButtons).toHaveLength(5);
  expect(firstButtons[0].textContent).toBe('filled');
  expect(firstButtons[1].textContent).toBe('empty');

  expect(secondButtons).toHaveLength(3);
  expect(secondButtons[0].textContent).toBe('filled');
  expect(secondButtons[1].textContent).toBe('filled');
  expect(secondButtons[2].textContent).toBe('filled');
});
// ---End Tests
