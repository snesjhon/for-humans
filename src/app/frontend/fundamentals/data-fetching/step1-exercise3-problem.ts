export {};

// Sealed Envelope, Level 1: extract data from an async loader
// Goal: combine ReturnType with your promise-unwrapping helper.

interface Alarm {
  id: string;
  severity: 'info' | 'warning' | 'critical';
}

async function fetchAlarms(): Promise<Alarm[]> {
  return [
    { id: 'a-1', severity: 'warning' },
    { id: 'a-2', severity: 'critical' },
  ];
}

type DeepAwaited<T> = T extends Promise<infer Value> ? DeepAwaited<Value> : T;

// TODO: Read the return type of TLoader, then unwrap the promise(s) around it.
type LoaderResult<TLoader extends (...args: never[]) => Promise<unknown>> = unknown;

type AlarmPayload = LoaderResult<typeof fetchAlarms>;

// Hover AlarmPayload while solving:
// - AlarmPayload should become Alarm[]
