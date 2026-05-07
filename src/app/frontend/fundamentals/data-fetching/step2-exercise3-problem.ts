export {};

// Sealed Envelope, Level 2: generic outside, specific inside
// Goal: return a success object whose data type matches the loader.

interface Device {
  id: string;
  name: string;
}

interface UserProfile {
  id: string;
  email: string;
}

async function fetchDevices(): Promise<Device[]> {
  return [{ id: 'd-1', name: 'Mixer' }];
}

async function fetchProfile(): Promise<UserProfile> {
  return { id: 'u-1', email: 'operator@example.com' };
}

type LoaderData<TLoader extends (...args: never[]) => Promise<unknown>> =
  Awaited<ReturnType<TLoader>>;

// TODO: Accept a loader and matching resolved data, then return { status: 'success', data }.
function buildSuccess<TLoader extends (...args: never[]) => Promise<unknown>>(
  _loader: TLoader,
  data: unknown,
) {
  return { status: 'success' as const, data };
}

const deviceState = buildSuccess(fetchDevices, [{ id: 'd-1', name: 'Mixer' }]);
const profileState = buildSuccess(fetchProfile, { id: 'u-1', email: 'operator@example.com' });

// Hover the values while solving:
// - deviceState.data should become Device[]
// - profileState.data should become UserProfile
