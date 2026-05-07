export {};

// Sealed Envelope, Level 1: nested promise wrappers
// Goal: keep peeling until you reach the final payload.

interface Tag {
  id: string;
  label: string;
}

type DeepAwaited<T> = T extends Promise<infer Value> ? DeepAwaited<Value> : T;

type TagsPayload = DeepAwaited<Promise<Promise<Tag[]>>>;
type NamePayload = DeepAwaited<Promise<Promise<Promise<string>>>>;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type TagsCheck = Expect<Equal<TagsPayload, Tag[]>>;
type NameCheck = Expect<Equal<NamePayload, string>>;
