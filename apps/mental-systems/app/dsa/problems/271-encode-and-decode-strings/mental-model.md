# Encode and Decode Strings — Mental Model

## The Problem

Design an algorithm to encode a list of strings to a single string. The encoded string is then sent over the network and is decoded back to the original list of strings. Machine A has to send a message to machine B, so implement the two methods `encode` and `decode`. Machine A calls `encode` before sending and Machine B calls `decode` after receiving.

**Example 1:**
```
Input:   ["hello", "world"]
Encoded: "5#hello5#world"
Output:  ["hello", "world"]
```

**Example 2:**
```
Input:   ["a#b", "cd"]
Encoded: "3#a#b2#cd"
Output:  ["a#b", "cd"]
```

**Example 3:**
```
Input:   [""]
Encoded: "0#"
Output:  [""]
```

## The Shipping Belt Analogy

Imagine a busy warehouse that ships packages across the country on a long conveyor belt. Before anything goes on the belt, a packer stamps a **shipping label** on each package. The label states exactly how many items are inside — say, `5 items` — followed by a dividing bar `|`, followed by the actual contents of the package. When the packages arrive, a warehouse worker at the other end reads each label, counts out exactly that many items from the belt, sets them aside as one package, then moves on to the next label.

The key insight is *how* the worker reads the belt. They never look for a special marker character inside the package contents. They read the label's count, take exactly that many items, and advance. This means even if a package happens to contain something that looks like a label — say, a box labeled `3|abc` sitting inside another package — the worker doesn't care. They already know how many items to take, and they stop counting the moment they hit the quota.

In this problem, we're the packer and the worker. Our strings are the packages. Encoding means stamping a length label on every string and loading everything onto one long belt (one big encoded string). Decoding means reading each label in turn and peeling off exactly that many characters to recover each original string. The separator between the label and the contents is `#` — our dividing bar — and what makes the scheme bulletproof is that we never scan for `#` inside the content. We always read by count.

## Understanding the Analogy

### The Setup

We have a pile of packages arriving at the loading dock. Each package can contain absolutely anything — any combination of symbols, numbers, or even characters that look like our label format. Our job is to load all of them onto a single conveyor belt in one continuous stream, then at the other end recover every original package without mixing up contents or accidentally splitting one package in two.

The constraint that makes this hard: we cannot agree on a special "end of package" character, because any character we pick might appear inside a package's contents. If we try to use `|` as a separator and a package contains `|`, the worker at the other end won't know whether that `|` is the separator or part of the contents.

### The Length Label

Instead of separating packages with a special character, we stamp a **length label** on the front of each package before it goes on the belt. The label says: "the next N characters on the belt are mine." The label is formatted as `N#` — the count as a string of digits, then the dividing `#`, then the N characters of content.

Why `#` as the divider between label and content? Because our label is always just digits, we know to read digits first, then look for the `#` that terminates the label. Once we see `#`, we stop reading the label and start counting out N characters of content. Crucially, we never search for another `#` inside those N characters — we count by the label, period.

Edge cases fall out naturally. An empty string gets the label `0#` — zero items, then the divider, then nothing. The worker reads `0`, skips the `#`, takes zero characters, and correctly recovers an empty string. A completely empty input list produces no labels at all, and decoding an empty belt returns an empty list.

### Why This Approach

Reading by count is robust because it makes the content **opaque**. The worker doesn't need to understand what's inside a package — they just count. If you tried to encode by joining with a delimiter like `,`, the moment any string contained a comma, the decoder would miscount. You'd be forced to escape every occurrence of the delimiter — which creates a new problem, since the escape character might appear too. Length-prefix encoding sidesteps the entire escaping problem: the content is never parsed, only counted.

The trade-off is that the encoded form is slightly longer (each string grows by the number of digits in its length plus one `#`). For most practical purposes that's fine — and the correctness guarantee you get in return is absolute.

## How I Think Through This

Encoding is the easy half: I iterate over every string `s` in the list, and for each one I stamp its label onto the belt by appending `${s.length}#${s}` to my running `belt` string. When I'm done, `belt` holds every package back-to-back with its label. No state beyond the belt itself — one pass, one append per string.

Decoding keeps a cursor `pos` that always points to the start of the next label on the belt. I scan forward from `pos` to find the `#` that terminates the label, parse the digits before `#` as `len`, compute `start = hashPos + 1` (the first character of the package content), extract `s.slice(start, start + len)` as the recovered package, then advance `pos` to `start + len`. The invariant that keeps the algorithm correct: `pos` always lands exactly on the first digit of the next label, never inside package contents, because I always advance by exactly `len` characters from `start`. I repeat until `pos` reaches the end of the belt.

Take `["a#b", "cd"]`.

:::trace-lr
[
  {"chars":["a#b","cd"],"L":0,"R":0,"action":null,"label":"Encode: belt is empty. Current package: 'a#b' (3 chars)."},
  {"chars":["a#b","cd"],"L":0,"R":0,"action":"match","label":"Stamp '3#a#b' on belt. Belt: '3#a#b'"},
  {"chars":["a#b","cd"],"L":1,"R":1,"action":"match","label":"Stamp '2#cd' on belt. Belt: '3#a#b2#cd'"},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":0,"R":1,"action":"match","label":"Decode: pos=0, scan to # at index 1 → len=3, start=2, take 'a#b', pos→5."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":5,"R":6,"action":"match","label":"pos=5, scan to # at index 6 → len=2, start=7, take 'cd', pos→9."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":8,"R":8,"action":"done","label":"pos=9 = belt length. Return: ['a#b', 'cd'] ✓"}
]
:::

---

## Building the Algorithm

Each step introduces one concept from the Shipping Belt analogy, then a StackBlitz embed to try it.

### Step 1: Stamp Each Package with Its Length Label (Encode)

The packer's job is simple: for every package in the pile, read off how many items it contains, write `{count}#`, then write the contents. Stack those labels back-to-back into one long belt string.

Walk through `["hi", "you"]`:
- Package `"hi"`: 2 items → stamp `2#hi` on the belt
- Package `"you"`: 3 items → stamp `3#you` on the belt
- Belt = `"2#hi3#you"`

The encode function visits every string once and appends one chunk. That's it.

:::trace-lr
[
  {"chars":["hi","you"],"L":0,"R":0,"action":null,"label":"Belt is empty. Current package: 'hi'."},
  {"chars":["hi","you"],"L":0,"R":0,"action":"match","label":"'hi' has 2 chars → stamp '2#hi' on belt. Belt: '2#hi'"},
  {"chars":["hi","you"],"L":1,"R":1,"action":"match","label":"'you' has 3 chars → stamp '3#you' on belt. Belt: '2#hi3#you'"},
  {"chars":["hi","you"],"L":1,"R":1,"action":"done","label":"All packages loaded. Belt = '2#hi3#you' ✓"}
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

### Step 2: Read Each Label and Count Out the Package (Decode)

The warehouse worker's job: stand at position zero of the belt with a clipboard for recovered packages. For each label, scan right to the `#`, read the count, skip the `#`, count out exactly that many characters, record the package, advance the cursor to the next label. Repeat until the belt is empty.

Walk through belt `"3#a#b2#cd"`:

- **pos=0**: scan right → `#` at index 1; count=3; start=2; take `s[2..4]` = `"a#b"`; pos→5
- **pos=5**: scan right → `#` at index 6; count=2; start=7; take `s[7..8]` = `"cd"`; pos→9
- pos=9 = belt length → done → `["a#b", "cd"]`

Notice: the `#` at index 3 inside `"a#b"` is never misread. The worker found `#` at index 1, counted three characters, and moved their cursor to index 5 — they never even looked at index 3.

:::trace-lr
[
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":0,"R":0,"action":null,"label":"Cursor (pos) at index 0. Scanning right to find the # that ends this label."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":0,"R":1,"action":"match","label":"Found # at index 1. Label = '3'. Content starts at index 2."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":2,"R":4,"action":"match","label":"Taking 3 chars (indices 2–4): 'a', '#', 'b' → package = 'a#b'. Advance pos → 5."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":5,"R":5,"action":null,"label":"Cursor (pos) at index 5. Scanning right to find the # that ends this label."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":5,"R":6,"action":"match","label":"Found # at index 6. Label = '2'. Content starts at index 7."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":7,"R":8,"action":"match","label":"Taking 2 chars (indices 7–8): 'c', 'd' → package = 'cd'. Advance pos → 9."},
  {"chars":["3","#","a","#","b","2","#","c","d"],"L":8,"R":8,"action":"done","label":"pos = 9 = belt length. Belt exhausted. Return: ['a#b', 'cd'] ✓"}
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

## Tracing through an Example

Encoding `["a#b", "cd"]` → `"3#a#b2#cd"`, then decoding:

| Phase | Cursor (pos) | Scanned To | Label Found | Content Start | Content End | Package Recovered | Clipboard |
|-------|---|---|---|---|---|---|---|
| Start | 0 | — | — | — | — | — | [] |
| Package 1 | 0 | `#` at index 1 | `"3"` | 2 | 4 | `"a#b"` | [`"a#b"`] |
| Package 2 | 5 | `#` at index 6 | `"2"` | 7 | 8 | `"cd"` | [`"a#b"`, `"cd"`] |
| Done | 9 | belt empty | — | — | — | — | return [`"a#b"`, `"cd"`] ✓ |

---

## Common Misconceptions

**"I can just join with a comma and split on commas when decoding."** — This works until any string contains a comma. The worker can't tell whether a comma is a package separator or part of the contents. Length-prefix encoding bypasses this entirely: the worker reads by count, so the contents are never parsed for structure.

**"The `#` separator could still appear inside a string and confuse the decoder."** — It can't, because the decoder never scans for `#` inside the content region. After reading a label and computing `len`, the decoder advances the cursor by exactly `len` characters. The cursor lands on the next label's first digit — and a label always starts with digits, never `#`. The only `#` the decoder ever searches for is the one that terminates the current label.

**"The decoder should find `#` by searching the entire remaining belt."** — This is correct *in combination* with reading only up to the first `#` from the current position. `indexOf('#', pos)` finds the `#` that terminates the current label because pos always points to the start of a numeric label — the first `#` to the right of pos is always the label terminator, not a `#` inside some package's contents.

**"An empty string in the list is a problem because there's nothing to put after the `#`."** — An empty string simply gets the label `0#`. The encoder stamps `0#` on the belt; the decoder reads count=0, skips `#`, takes zero characters, and records `""` on the clipboard. Empty strings work exactly the same as any other string.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
