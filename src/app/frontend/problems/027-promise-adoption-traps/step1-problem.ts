type User = {
  id: number;
  name: string;
};

function readUserWithCallback(
  id: number,
  onComplete: (user: User) => void,
): void {
  setTimeout(() => {
    onComplete({ id, name: `User ${id}` });
  }, 20);
}

// Goal: settle the promise from the callback that receives the finished user.
export function loadUser(id: number): Promise<User | null> {
  return new Promise((resolve) => {
    let user: User | null = null;

    readUserWithCallback(id, (result) => {
      user = result;
    });

    resolve(user);
  });
}

// ---Tests
test('resolves with the user after the callback runs', async () => {
  jest.useFakeTimers();

  const promise = loadUser(2);
  jest.runAllTimers();
  const user = await promise;

  expect(user).toEqual({ id: 2, name: 'User 2' });
  jest.useRealTimers();
});

test('does not settle before the callback fires', async () => {
  jest.useFakeTimers();
  let settled = false;

  loadUser(2).then(() => {
    settled = true;
  });

  await Promise.resolve();
  await Promise.resolve();

  expect(settled).toBe(false);

  jest.runAllTimers();
  await Promise.resolve();
  await Promise.resolve();

  expect(settled).toBe(true);
  jest.useRealTimers();
});
// ---End Tests
