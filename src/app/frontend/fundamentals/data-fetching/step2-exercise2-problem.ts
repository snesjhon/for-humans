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

// TODO: Build a success object whose data property matches LoaderData<TLoader>.
type AsyncSuccess<TLoader extends (...args: never[]) => Promise<unknown>> = never;

type DevicesSuccess = AsyncSuccess<typeof fetchDevices>;
type ProfileSuccess = AsyncSuccess<typeof fetchProfile>;

// Hover the aliases while solving:
// - DevicesSuccess should become { status: 'success'; data: Device[] }
// - ProfileSuccess should become { status: 'success'; data: UserProfile }
