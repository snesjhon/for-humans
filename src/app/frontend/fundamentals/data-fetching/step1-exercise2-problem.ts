export {};

// Sealed Envelope, Level 1: nested promise wrappers
// Goal: keep peeling until you reach the final payload.

interface Tag {
  id: string;
  label: string;
}

// TODO: Recurse while T is Promise<...>. Stop when T is no longer a Promise.
type DeepAwaited<T> = T;

type TagsPayload = DeepAwaited<Promise<Promise<Tag[]>>>;
type NamePayload = DeepAwaited<Promise<Promise<Promise<string>>>>;

// Hover the aliases while solving:
// - TagsPayload should become Tag[]
// - NamePayload should become string
