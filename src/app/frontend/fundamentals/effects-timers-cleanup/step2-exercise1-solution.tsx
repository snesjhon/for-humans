/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

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
  }, [userId]);

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

  expect(result.current).toBe('Bob Smith');
});
// ---End Tests
