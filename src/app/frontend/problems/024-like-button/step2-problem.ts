/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';

export type LikeButtonTone =
  | 'neutral'
  | 'preview'
  | 'active'
  | 'active-hover';

export type LikeButtonView = {
  liked: boolean;
  hovered: boolean;
  label: string;
  icon: 'heart-outline' | 'heart-filled';
  tone: LikeButtonTone;
  ariaPressed: boolean;
  toggleLike: () => void;
  pointerEnter: () => void;
  pointerLeave: () => void;
};

// Goal: keep hover as a separate fact and derive the tone from both facts.
export function useLikeButton(): LikeButtonView {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tone, setTone] = useState<LikeButtonTone>('neutral');

  function toggleLike() {
    setLiked((current) => !current);
    setTone(liked ? 'neutral' : 'active');
  }

  function pointerEnter() {
    setHovered(true);
    setTone(liked ? 'active-hover' : 'preview');
  }

  function pointerLeave() {
    setHovered(false);
    setTone('neutral');
  }

  return {
    liked,
    hovered,
    label: liked ? 'Liked' : 'Like',
    icon: liked ? 'heart-filled' : 'heart-outline',
    tone,
    ariaPressed: liked,
    toggleLike,
    pointerEnter,
    pointerLeave,
  };
}

// ---Tests
test('hover previews the unliked button without toggling it on', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.pointerEnter();
  });

  expect(result.current.hovered).toBe(true);
  expect(result.current.liked).toBe(false);
  expect(result.current.tone).toBe('preview');
  expect(result.current.label).toBe('Like');
});

test('liked button stays active after the pointer leaves', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.toggleLike();
    result.current.pointerEnter();
    result.current.pointerLeave();
  });

  expect(result.current.liked).toBe(true);
  expect(result.current.hovered).toBe(false);
  expect(result.current.tone).toBe('active');
  expect(result.current.label).toBe('Liked');
});
// ---End Tests
