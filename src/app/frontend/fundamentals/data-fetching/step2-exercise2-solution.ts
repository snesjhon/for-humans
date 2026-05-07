export {};

// Sealed Envelope, Level 2: type the success branch from the loader
// Goal: make data match whatever the loader resolves to.

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

type AsyncSuccess<TLoader extends (...args: never[]) => Promise<unknown>> = {
  status: 'success';
  data: LoaderData<TLoader>;
};

type DevicesSuccess = AsyncSuccess<typeof fetchDevices>;
type ProfileSuccess = AsyncSuccess<typeof fetchProfile>;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type DevicesCheck = Expect<
  Equal<DevicesSuccess, { status: 'success'; data: Device[] }>
>;
type ProfileCheck = Expect<
  Equal<ProfileSuccess, { status: 'success'; data: UserProfile }>
>;
