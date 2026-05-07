export {};

// Sealed Envelope, Level 2: inherit the payload type from the loader
// Goal: derive the resolved data type from any async loader function.

interface Device {
  id: string;
  name: string;
}

interface Alarm {
  id: string;
  severity: 'info' | 'warning' | 'critical';
}

async function fetchDevices(): Promise<Device[]> {
  return [{ id: 'd-1', name: 'Mixer' }];
}

async function fetchAlarmCount(): Promise<number> {
  return 3;
}

type DeepAwaited<T> = T extends Promise<infer Value> ? DeepAwaited<Value> : T;

type LoaderData<TLoader extends (...args: never[]) => Promise<unknown>> =
  DeepAwaited<ReturnType<TLoader>>;

type DevicesData = LoaderData<typeof fetchDevices>;
type AlarmCountData = LoaderData<typeof fetchAlarmCount>;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type DevicesCheck = Expect<Equal<DevicesData, Device[]>>;
type AlarmCountCheck = Expect<Equal<AlarmCountData, number>>;
