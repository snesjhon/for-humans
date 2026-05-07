export {};

// Sealed Envelope, Level 1: one promise wrapper
// Goal: extract the payload type from Promise<T>.

interface Device {
  id: string;
  status: 'online' | 'offline';
}

// TODO: If T is Promise<something>, return that inner something. Otherwise return T unchanged.
type UnwrapPromise<T> = T;

type DevicePayload = UnwrapPromise<Promise<Device>>;
type RetryCountPayload = UnwrapPromise<Promise<number>>;

// Hover the aliases while solving:
// - DevicePayload should become Device
// - RetryCountPayload should become number
