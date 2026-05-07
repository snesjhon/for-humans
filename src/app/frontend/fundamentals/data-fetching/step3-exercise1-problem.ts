export {};

// Sealed Envelope, Level 3: the full delivery board
// Goal: model idle, loading, success, and error as one discriminated union.

interface Device {
  id: string;
  name: string;
}

// TODO: Build a union over the four async phases.
// - idle has only status
// - loading has only status
// - success has status plus data: TData
// - error has status plus error: string
type AsyncState<TData> = never;

type DeviceState = AsyncState<Device[]>;

// Hover DeviceState while solving:
// - it should be a union over idle/loading/success/error
