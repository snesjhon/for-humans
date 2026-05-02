export async function delay(ms: number, log: string[]): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, ms));
  log.push('done');
}

// ---Tests
test('delay resolves only after the timer fires', async () => {
  jest.useFakeTimers();
  const log: string[] = [];
  let settled = false;

  const p = delay(100, log).then(() => {
    settled = true;
  });

  await Promise.resolve();
  await Promise.resolve();

  expect(settled).toBe(false);
  expect(log).toEqual([]);

  jest.runAllTimers();
  await p;

  expect(settled).toBe(true);
  expect(log).toEqual(['done']);
  jest.useRealTimers();
});

test('done is in the log when the promise resolves', async () => {
  jest.useFakeTimers();
  const log: string[] = [];

  const p = delay(100, log);
  jest.runAllTimers();
  await p;

  expect(log).toEqual(['done']);
  jest.useRealTimers();
});
// ---End Tests
