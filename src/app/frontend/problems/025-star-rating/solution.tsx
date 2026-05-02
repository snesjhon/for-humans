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

// Goal: build the full reusable widget so props control the initial shape, clicks update the saved rating, hover temporarily takes priority, pointer leave restores the saved state, and multiple instances stay independent.
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
            {isFilled ? 'filled-star' : 'empty-star'}
          </button>
        );
      })}
    </div>
  );
}

// ---Tests
test('renders the requested number of stars and starts from the provided rating', () => {
  render(<StarRating maxStars={3} initialFilledStars={2} />);

  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(3);
  expect(buttons[0].textContent).toBe('filled-star');
  expect(buttons[1].textContent).toBe('filled-star');
  expect(buttons[2].textContent).toBe('empty-star');
});

test('clicking a star fills that star and all stars to its left', () => {
  render(<StarRating maxStars={5} initialFilledStars={0} />);

  fireEvent.click(screen.getAllByRole('button')[3]);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled-star');
  expect(buttons[1].textContent).toBe('filled-star');
  expect(buttons[2].textContent).toBe('filled-star');
  expect(buttons[3].textContent).toBe('filled-star');
  expect(buttons[4].textContent).toBe('empty-star');
});

test('hover preview takes priority over the saved selection', () => {
  render(<StarRating maxStars={5} initialFilledStars={4} />);

  fireEvent.mouseEnter(screen.getAllByRole('button')[1]);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled-star');
  expect(buttons[1].textContent).toBe('filled-star');
  expect(buttons[2].textContent).toBe('empty-star');
  expect(buttons[3].textContent).toBe('empty-star');
});

test('leaving without clicking restores the saved selection', () => {
  render(<StarRating maxStars={5} initialFilledStars={4} />);

  const secondStar = screen.getAllByRole('button')[1];
  fireEvent.mouseEnter(secondStar);
  fireEvent.mouseLeave(secondStar);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled-star');
  expect(buttons[1].textContent).toBe('filled-star');
  expect(buttons[2].textContent).toBe('filled-star');
  expect(buttons[3].textContent).toBe('filled-star');
  expect(buttons[4].textContent).toBe('empty-star');
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
  expect(firstButtons[0].textContent).toBe('filled-star');
  expect(firstButtons[1].textContent).toBe('empty-star');

  expect(secondButtons).toHaveLength(3);
  expect(secondButtons[0].textContent).toBe('filled-star');
  expect(secondButtons[1].textContent).toBe('filled-star');
  expect(secondButtons[2].textContent).toBe('filled-star');
});
// ---End Tests
