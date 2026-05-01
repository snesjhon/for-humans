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

function getTone(liked: boolean, hovered: boolean): LikeButtonTone {
  if (liked && hovered) return 'active-hover';
  if (liked) return 'active';
  if (hovered) return 'preview';
  return 'neutral';
}

// Goal: store only the button facts, then derive the entire appearance snapshot.
export function useLikeButton(): LikeButtonView {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return {
    liked,
    hovered,
    label: liked ? 'Liked' : 'Like',
    icon: liked ? 'heart-filled' : 'heart-outline',
    tone: getTone(liked, hovered),
    ariaPressed: liked,
    toggleLike: () => setLiked((current) => !current),
    pointerEnter: () => setHovered(true),
    pointerLeave: () => setHovered(false),
  };
}

// ---Tests
test('initial snapshot is the neutral unliked button', () => {
  const { result } = renderHook(() => useLikeButton());

  expect(result.current.liked).toBe(false);
  expect(result.current.hovered).toBe(false);
  expect(result.current.label).toBe('Like');
  expect(result.current.icon).toBe('heart-outline');
  expect(result.current.tone).toBe('neutral');
  expect(result.current.ariaPressed).toBe(false);
});

test('hover previews the unliked snapshot without changing the choice', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.pointerEnter();
  });

  expect(result.current.hovered).toBe(true);
  expect(result.current.liked).toBe(false);
  expect(result.current.label).toBe('Like');
  expect(result.current.tone).toBe('preview');
});

test('clicking toggles the persistent liked snapshot', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.toggleLike();
  });

  expect(result.current.liked).toBe(true);
  expect(result.current.label).toBe('Liked');
  expect(result.current.icon).toBe('heart-filled');
  expect(result.current.tone).toBe('active');
  expect(result.current.ariaPressed).toBe(true);
});

test('hovering a liked button keeps the active fact and adds the hover preview', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.toggleLike();
    result.current.pointerEnter();
  });

  expect(result.current.liked).toBe(true);
  expect(result.current.hovered).toBe(true);
  expect(result.current.tone).toBe('active-hover');
});

test('leaving a liked button removes only the hover fact', () => {
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

test('second click returns the button to the original snapshot', () => {
  const { result } = renderHook(() => useLikeButton());

  act(() => {
    result.current.toggleLike();
    result.current.toggleLike();
  });

  expect(result.current.liked).toBe(false);
  expect(result.current.hovered).toBe(false);
  expect(result.current.label).toBe('Like');
  expect(result.current.icon).toBe('heart-outline');
  expect(result.current.tone).toBe('neutral');
  expect(result.current.ariaPressed).toBe(false);
});
// ---End Tests
