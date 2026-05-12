/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Goal: Add userId to the dep array so the hook re-fetches when userId changes.
// With an empty dep array, the fetch runs once on mount. After that, userId
// changes are invisible to the effect — the hook shows stale data indefinitely.

const userDb: Record<string, string> = {
  alice: 'Alice Johnson',
  bob: 'Bob Smith',
  carol: 'Carol White',
};

function fakeGetUser(userId: string): Promise<string> {
  return Promise.resolve(userDb[userId] ?? 'Unknown');
}

function useUserName(userId: string) {
  const [name, setName] = useState('');

  useEffect(() => {
    fakeGetUser(userId).then(setName);
  }, []); // TODO: add userId to the dep array

  return name;
}

// ---Tests
test('fetches the name for the initial userId', async () => {
  const { result } = renderHook(
    ({ userId }: { userId: string }) => useUserName(userId),
    { initialProps: { userId: 'alice' } }
  );

  await act(async () => { await Promise.resolve(); });

  expect(result.current).toBe('Alice Johnson');
});

test('re-fetches when userId changes', async () => {
  const { result, rerender } = renderHook(
    ({ userId }: { userId: string }) => useUserName(userId),
    { initialProps: { userId: 'alice' } }
  );

  await act(async () => { await Promise.resolve(); });
  expect(result.current).toBe('Alice Johnson');

  rerender({ userId: 'bob' });
  await act(async () => { await Promise.resolve(); });

  // Without the fix: still 'Alice Johnson' (empty dep array, effect never re-ran)
  expect(result.current).toBe('Bob Smith');
});
// ---End Tests
