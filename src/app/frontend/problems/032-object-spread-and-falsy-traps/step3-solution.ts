// Nullish coalescing keeps 0, false, and '' while still replacing null and
// undefined.
export function chooseValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}
