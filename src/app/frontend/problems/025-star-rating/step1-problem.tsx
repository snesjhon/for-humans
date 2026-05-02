/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

interface StarRatingProps {}

// Goal: add maxStars and initialFilledStars props, then render exactly that many star buttons with the correct starting filled and empty text.
export function StarRating({}: StarRatingProps) {
  return <div />;
}

// ---Tests
test('renders the requested number of stars', () => {
  render(<StarRating {...({ maxStars: 3, initialFilledStars: 2 } as any)} />);

  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(3);
});

test('starts with the provided number of filled stars', () => {
  render(<StarRating {...({ maxStars: 4, initialFilledStars: 2 } as any)} />);

  const buttons = screen.getAllByRole('button');
  expect(buttons[0].textContent).toBe('filled');
  expect(buttons[1].textContent).toBe('filled');
  expect(buttons[2].textContent).toBe('empty');
  expect(buttons[3].textContent).toBe('empty');
});
// ---End Tests
