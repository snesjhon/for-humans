export {};

// Sealed Envelope, Level 3: the full delivery board
// Goal: model idle, loading, success, and error as one discriminated union.

interface Device {
  id: string;
  name: string;
}

type AsyncState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: string };

type DeviceState = AsyncState<Device[]>;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type DeviceStateCheck = Expect<
  Equal<
    DeviceState,
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: Device[] }
    | { status: 'error'; error: string }
  >
>;
