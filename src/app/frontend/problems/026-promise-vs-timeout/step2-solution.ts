export function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 50);
  });
}

// ---Tests
test('resolves with the user object, not null', async () => {
  jest.useFakeTimers();

  const promise = fetchUser(1);
  jest.runAllTimers();
  const result = await promise;

  expect(result).not.toBeNull();
  expect(result).toEqual({ id: 1, name: 'User 1' });
  jest.useRealTimers();
});

test('does not resolve before the timer fires', async () => {
  jest.useFakeTimers();
  let resolved = false;

  fetchUser(1).then(() => {
    resolved = true;
  });

  await Promise.resolve();
  await Promise.resolve();

  expect(resolved).toBe(false);

  jest.runAllTimers();
  await Promise.resolve();
  await Promise.resolve();

  expect(resolved).toBe(true);
  jest.useRealTimers();
});
// ---End Tests
