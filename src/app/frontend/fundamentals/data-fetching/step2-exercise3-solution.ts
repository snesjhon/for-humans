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

function buildSuccess<TLoader extends (...args: never[]) => Promise<unknown>>(
  _loader: TLoader,
  data: LoaderData<TLoader>,
) {
  return { status: 'success' as const, data };
}

const deviceState = buildSuccess(fetchDevices, [{ id: 'd-1', name: 'Mixer' }]);
const profileState = buildSuccess(fetchProfile, { id: 'u-1', email: 'operator@example.com' });

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type DeviceStateCheck = Expect<
  Equal<typeof deviceState, { status: 'success'; data: Device[] }>
>;
type ProfileStateCheck = Expect<
  Equal<typeof profileState, { status: 'success'; data: UserProfile }>
>;
