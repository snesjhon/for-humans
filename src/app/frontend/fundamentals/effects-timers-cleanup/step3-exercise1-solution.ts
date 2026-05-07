export {};

// AbortController, Level 3: wire the cleanup handle into fetch
// Goal: create a controller, pass its signal to fetch, and return both.
type FetchLike = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<{ ok: boolean }>;

function startAbortableRequest(fetchImpl: FetchLike, url: string) {
  const controller = new AbortController();
  const request = fetchImpl(url, { signal: controller.signal });

  return {
    controller,
    request,
  };
}

test('startAbortableRequest passes an AbortSignal into fetch', async () => {
  const fetchImpl = jest.fn(async () => ({ ok: true }));

  const { controller, request } = startAbortableRequest(fetchImpl, '/api/devices');
  await request;

  expect(fetchImpl).toHaveBeenCalledWith('/api/devices', {
    signal: expect.any(AbortSignal),
  });
  expect(controller).toBeInstanceOf(AbortController);
});
