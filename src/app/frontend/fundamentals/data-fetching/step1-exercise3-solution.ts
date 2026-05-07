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

type LoaderResult<TLoader extends (...args: never[]) => Promise<unknown>> =
  DeepAwaited<ReturnType<TLoader>>;

type AlarmPayload = LoaderResult<typeof fetchAlarms>;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type AlarmPayloadCheck = Expect<Equal<AlarmPayload, Alarm[]>>;
