export {};

interface DeviceCard {
  id: string;
  status: 'online' | 'offline';
  label: string;
  alarms: number;
}

// Goal: type pick so the keys argument can only name real properties from the object you pass in.
// Hint: the return type should stay linked to those chosen keys, not fall back to a loose record.
// This is the classic "one generic depends on another generic" case, so think about which type parameter needs a constraint.
// TODO: type this helper so `keys` must be valid keys of `value`
// and the return type becomes Pick<T, K>.
function pick(value: object, keys: readonly string[]) {
  const result: Record<string, unknown> = {};

  for (const key of keys) {
    result[key] = (value as Record<string, unknown>)[key];
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

// Hover `summary` while solving:
// it should become Pick<DeviceCard, 'id' | 'status'>.
