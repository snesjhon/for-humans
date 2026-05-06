/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: the banner should appear on the click that reaches the goal, not one click later.
function useGoalTracker(goal: number) {
  const [likes, setLikes] = useState(goal - 1);
  const [banner, setBanner] = useState('Keep going');

  function clickLike() {
    setLikes(likes + 1);

    if (likes >= goal) {
      setBanner('Goal reached');
    }
  }

  return { likes, banner, clickLike };
}

// ---Tests
test('count and banner agree on the same goal-reaching click', () => {
  const { result } = renderHook(() => useGoalTracker(3));

  act(() => {
    result.current.clickLike();
  });

  expect(result.current.likes).toBe(3);
  expect(result.current.banner).toBe('Goal reached');
});
// ---End Tests
