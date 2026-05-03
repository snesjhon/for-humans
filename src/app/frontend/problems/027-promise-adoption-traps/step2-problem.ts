type User = {
  id: number;
  name: string;
};

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 20);
  });
}

// Goal: return the nested promise so the chain waits for the uppercase name.
export function loadUppercaseName(id: number): Promise<string> {
  return Promise.resolve(id).then((userId) => {
    fetchUser(userId).then((user) => user.name.toUpperCase());
    return 'PENDING';
  });
}

// ---Tests
test('resolves with the transformed async result', async () => {
  jest.useFakeTimers();

  const promise = loadUppercaseName(4);
  jest.runAllTimers();
  const name = await promise;

  expect(name).toBe('USER 4');
  jest.useRealTimers();
});

test('does not resolve before the nested promise finishes', async () => {
  jest.useFakeTimers();
  let settled = false;

  const promise = loadUppercaseName(4).then(() => {
    settled = true;
  });

  await Promise.resolve();
  await Promise.resolve();

  expect(settled).toBe(false);

  jest.runAllTimers();
  await promise;

  expect(settled).toBe(true);
  jest.useRealTimers();
});
// ---End Tests
