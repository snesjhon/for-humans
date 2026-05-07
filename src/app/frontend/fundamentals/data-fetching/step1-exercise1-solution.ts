export {};

// Sealed Envelope, Level 1: one promise wrapper
// Goal: extract the payload type from Promise<T>.

interface Device {
  id: string;
  status: 'online' | 'offline';
}

type UnwrapPromise<T> = T extends Promise<infer Value> ? Value : T;

type DevicePayload = UnwrapPromise<Promise<Device>>;
type RetryCountPayload = UnwrapPromise<Promise<number>>;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type DeviceCheck = Expect<Equal<DevicePayload, Device>>;
type RetryCountCheck = Expect<Equal<RetryCountPayload, number>>;
