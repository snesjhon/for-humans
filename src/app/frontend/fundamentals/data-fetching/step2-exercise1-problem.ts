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

// TODO: Read TLoader's return type and unwrap it to the resolved payload.
type LoaderData<TLoader extends (...args: never[]) => Promise<unknown>> = unknown;

type DevicesData = LoaderData<typeof fetchDevices>;
type AlarmCountData = LoaderData<typeof fetchAlarmCount>;

// Hover the aliases while solving:
// - DevicesData should become Device[]
// - AlarmCountData should become number
