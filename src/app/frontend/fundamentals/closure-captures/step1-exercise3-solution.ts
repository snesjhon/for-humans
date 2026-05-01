/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

type Profile = {
  name: string;
  city: string;
};

// Goal: let each delayed patch merge into the live profile object that React hands back at commit time.
function useQueuedProfile() {
  const [profile, setProfile] = useState<Profile>({ name: '', city: '' });

  function queuePrefill() {
    setTimeout(
      () => setProfile((current) => ({ ...current, name: 'Ada' })),
      10,
    );
    setTimeout(
      () => setProfile((current) => ({ ...current, city: 'Paris' })),
      20,
    );
  }

  return { profile, queuePrefill };
}

// ---Tests
test('queued profile patches preserve both fields', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useQueuedProfile());

  act(() => {
    result.current.queuePrefill();
    jest.advanceTimersByTime(20);
  });

  expect(result.current.profile).toEqual({ name: 'Ada', city: 'Paris' });
});
// ---End Tests
