/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';

export type LikeButtonView = {
  liked: boolean;
  label: string;
  icon: 'heart-outline' | 'heart-filled';
  ariaPressed: boolean;
  toggleLike: () => void;
};

// Goal: store the liked fact once, then derive the persistent visuals from it.
export function useLikeButton(): LikeButtonView {
  const [liked, setLiked] = useState(false);

  return {
    liked,
    label: liked ? 'Liked' : 'Like',
    icon: liked ? 'heart-filled' : 'heart-outline',
    ariaPressed: liked,
    toggleLike: () => setLiked((current) => !current),
  };
}

// ---Tests
test('first click switches the button into the liked snapshot', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.toggleLike();
  });

  expect(result.current.liked).toBe(true);
  expect(result.current.label).toBe('Liked');
  expect(result.current.icon).toBe('heart-filled');
  expect(result.current.ariaPressed).toBe(true);
});

test('second click returns the button to the neutral snapshot', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.toggleLike();
    result.current.toggleLike();
  });

  expect(result.current.liked).toBe(false);
  expect(result.current.label).toBe('Like');
  expect(result.current.icon).toBe('heart-outline');
  expect(result.current.ariaPressed).toBe(false);
});
// ---End Tests
