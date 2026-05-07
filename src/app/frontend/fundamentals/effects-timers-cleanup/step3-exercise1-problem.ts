export {};

// AbortController, Level 3: wire the cleanup handle into fetch
// Goal: create a controller, pass its signal to fetch, and return both.
type FetchLike = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<{ ok: boolean }>;

function startAbortableRequest(fetchImpl: FetchLike, url: string) {
  // TODO: create an AbortController and pass controller.signal to fetchImpl.
  const request = fetchImpl(url);

  return {
    controller: null,
    request,
  };
}

test.skip('startAbortableRequest passes an AbortSignal into fetch', async () => {
  const fetchImpl = jest.fn(async () => ({ ok: true }));

  const { controller, request } = startAbortableRequest(fetchImpl, '/api/devices');
  await request;

  expect(fetchImpl).toHaveBeenCalledWith('/api/devices', {
    signal: expect.any(AbortSignal),
  });
  expect(controller).toBeInstanceOf(AbortController);
});
