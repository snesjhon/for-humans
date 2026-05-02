export function scheduleWork(log: string[]): void {
  log.push('start');
  Promise.resolve().then(() => { log.push('micro'); });
  setTimeout(() => { log.push('macro'); }, 0);
}

// ---Tests
test('start fires synchronously before any queue drains', () => {
  jest.useFakeTimers();
  const log: string[] = [];

  scheduleWork(log);

  expect(log).toEqual(['start']);
  jest.useRealTimers();
});

test('full order matches the two-queue model', async () => {
  jest.useFakeTimers();
  const log: string[] = [];

  scheduleWork(log);
  await Promise.resolve();
  jest.runAllTimers();

  expect(log).toEqual(['start', 'micro', 'macro']);
  jest.useRealTimers();
});
// ---End Tests
