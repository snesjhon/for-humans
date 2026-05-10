export {};

interface DeviceCard {
  id: string;
  status: 'online' | 'offline';
  label: string;
  alarms: number;
}

function pick<T, K extends keyof T>(value: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    result[key] = value[key];
  }

  return result;
}

const summary = pick(
  {
    id: 'pump-1',
    status: 'online',
    label: 'Feed Pump',
    alarms: 2,
  } satisfies DeviceCard,
  ['id', 'status'] as const,
);

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type SummaryCheck = Expect<
  Equal<typeof summary, Pick<DeviceCard, 'id' | 'status'>>
>;
