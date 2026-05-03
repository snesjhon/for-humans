type User = {
  id: number;
  name: string;
};

type FetchUser = (id: number) => Promise<User>;

// Goal: return the retry branch from catch so recovery replaces the original failure.
export function loadUppercaseNameWithRetry(
  id: number,
  fetchUser: FetchUser,
): Promise<string> {
  return fetchUser(id)
    .then((user) => user.name.toUpperCase())
    .catch(() => {
      return fetchUser(id).then((user) => user.name.toUpperCase());
    });
}

// ---Tests
test('returns the retry result when the first attempt fails', async () => {
  const fetchUser: FetchUser = jest
    .fn<ReturnType<FetchUser>, Parameters<FetchUser>>()
    .mockRejectedValueOnce(new Error('temporary'))
    .mockResolvedValueOnce({ id: 7, name: 'User 7' });

  await expect(loadUppercaseNameWithRetry(7, fetchUser)).resolves.toBe(
    'USER 7',
  );
  expect(fetchUser).toHaveBeenCalledTimes(2);
});

test('does not retry when the first attempt already succeeds', async () => {
  const fetchUser: FetchUser = jest
    .fn<ReturnType<FetchUser>, Parameters<FetchUser>>()
    .mockResolvedValueOnce({ id: 7, name: 'User 7' });

  await expect(loadUppercaseNameWithRetry(7, fetchUser)).resolves.toBe(
    'USER 7',
  );
  expect(fetchUser).toHaveBeenCalledTimes(1);
});
// ---End Tests
