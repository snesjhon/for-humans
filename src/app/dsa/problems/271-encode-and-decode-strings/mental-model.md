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

The key insight is _how_ the worker reads the belt. They never look for a special marker character inside the package contents. They read the label's count, take exactly that many items, and advance. This means even if a package happens to contain something that looks like a label — say, a box labeled `3|abc` sitting inside another package — the worker doesn't care. They already know how many items to take, and they stop counting the moment they hit the quota.

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

I think about this in two passes. When I encode, I do the packer's job: for each string, I stamp its length, add `#`, then place the string right after it. I am not trying to protect special characters inside the string. I am making that unnecessary by telling the decoder exactly how many characters belong to this package.

When I decode, I keep one cursor at the start of the next label. I read digits until `#`, turn that into a length, then take exactly that many characters as the payload. After that, I jump the cursor to the next label and repeat. The thing I keep reminding myself is: once I know the length, the contents are opaque. I do not inspect them for structure. I just count.

Take `["a#b", "cd"]`.

:::trace-parse
[
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":0,"tone":"label"},{"start":1,"end":1,"tone":"separator"},{"start":2,"end":4,"tone":"payload"},{"start":5,"end":5,"tone":"label"},{"start":6,"end":6,"tone":"separator"},{"start":7,"end":8,"tone":"payload"}],"facts":[{"name":"input","value":"[\"a#b\", \"cd\"]","tone":"blue"},{"name":"encoded belt","value":"3#a#b2#cd","tone":"green"}],"action":"read","label":"One belt can hold multiple stamped packages back-to-back. Each package is just length label, separator, then payload."}
]
:::

---

## Building the Algorithm

Each step introduces one concept from the Shipping Belt analogy, then code blocks to try it.

For both steps, use the same running example:

- input strings: `["a#b", "cd"]`
- encoded belt: `"3#a#b2#cd"`

### Step 1: Stamp Each Package with Its Length Label (Encode)

The packer's job is simple: for every package in the pile, read off how many items it contains, write `{count}#`, then write the contents. Stack those labels back-to-back into one long belt string.

The encode function visits every string once and appends one chunk. That's it.

Consider `["a#b", "cd"]`. At this step, the only thing that matters is how each original string is stamped onto the belt. The trace shows each package being turned into one `{length}#payload` chunk, building the final encoded belt `"3#a#b2#cd"`.

:::trace-parse
[
{"tape":[],"facts":[{"name":"current string","value":"a#b","tone":"green"}],"action":null,"label":"The belt starts empty. The encoder is about to stamp the package 'a#b'."},
{"tape":["3","#","a","#","b"],"regions":[{"start":0,"end":0,"tone":"label"},{"start":1,"end":1,"tone":"separator"},{"start":2,"end":4,"tone":"payload"}],"facts":[{"name":"appended","value":"3#a#b","tone":"green"},{"name":"belt","value":"3#a#b","tone":"blue"}],"action":"emit","label":"'a#b' becomes one stamped package: 3#a#b."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":4,"tone":"consumed"},{"start":5,"end":5,"tone":"label"},{"start":6,"end":6,"tone":"separator"},{"start":7,"end":8,"tone":"payload"}],"facts":[{"name":"appended","value":"2#cd","tone":"green"},{"name":"belt","value":"3#a#b2#cd","tone":"blue"}],"action":"done","label":"The next package is stamped directly after the first. The finished belt is 3#a#b2#cd."}
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

### Step 2: Read Each Label and Count Out the Package (Decode)

The key idea during decoding is to treat `pos` as the start of the next label, not the start of an arbitrary substring. From that position, the decoder scans to the next `#`, reads the digits before it as the length, and uses that length to determine exactly where the current string ends.

Once the length is known, the next `len` characters are treated as payload, not structure. They are taken as one whole string without inspecting their contents. That is why a value like `"a#b"` does not cause confusion: after reading `3#`, the decoder already knows the next three characters belong together, so the `#` inside the payload is just another character.

The invariant to keep in mind is that `pos` always lands on the first digit of the next label. After the decoder skips past `#` and consumes exactly `len` characters, it arrives at the next package boundary, which keeps the whole parse aligned from start to finish.

Now use the encoded belt from Step 1: `"3#a#b2#cd"`. This trace shows how the decoder reads that same belt back into `["a#b", "cd"]` by staying aligned from one label boundary to the next.

:::trace-parse
[
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":8,"tone":"upcoming"}],"pointers":[{"index":0,"label":"pos","tone":"blue"}],"facts":[{"name":"pos","value":0,"tone":"blue"}],"action":"scan","label":"The decoder starts with pos at index 0, which must be the beginning of the next label."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":0,"tone":"label"},{"start":1,"end":1,"tone":"separator"},{"start":2,"end":4,"tone":"payload"},{"start":5,"end":8,"tone":"upcoming"}],"pointers":[{"index":0,"label":"pos","tone":"blue"},{"index":1,"label":"hashPos","tone":"orange"}],"facts":[{"name":"hashPos","value":1,"tone":"orange"}],"action":"scan","label":"Scanning right from pos finds the # at index 1, so the current label ends there."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":0,"tone":"label"},{"start":1,"end":1,"tone":"separator"},{"start":2,"end":4,"tone":"payload"},{"start":5,"end":8,"tone":"upcoming"}],"pointers":[{"index":0,"label":"pos","tone":"blue"},{"index":1,"label":"hashPos","tone":"orange"}],"facts":[{"name":"label","value":"3","tone":"blue"},{"name":"len","value":3,"tone":"green"},{"name":"start","value":2,"tone":"orange"}],"action":"read","label":"The digits from pos to hashPos form the label 3. So len = 3 and the payload starts at index 2."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":1,"tone":"consumed"},{"start":2,"end":4,"tone":"active"},{"start":5,"end":8,"tone":"upcoming"}],"facts":[{"name":"slice","value":"a#b","tone":"green"}],"action":"take","label":"The next 3 characters are taken as one payload: a#b. The # inside that span is just content."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":4,"tone":"consumed"},{"start":5,"end":8,"tone":"upcoming"}],"pointers":[{"index":5,"label":"pos","tone":"purple"}],"facts":[{"name":"next pos","value":5,"tone":"purple"}],"action":"jump","label":"After consuming exactly len characters, pos jumps to index 5, which is the next label boundary."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":4,"tone":"consumed"},{"start":5,"end":5,"tone":"label"},{"start":6,"end":6,"tone":"separator"},{"start":7,"end":8,"tone":"payload"}],"pointers":[{"index":5,"label":"pos","tone":"blue"},{"index":6,"label":"hashPos","tone":"orange"}],"facts":[{"name":"label","value":"2","tone":"blue"},{"name":"len","value":2,"tone":"green"},{"name":"start","value":7,"tone":"orange"}],"action":"read","label":"The same reasoning repeats at the new pos. Read the label 2, then identify the next 2-character payload."},
{"tape":["3","#","a","#","b","2","#","c","d"],"regions":[{"start":0,"end":6,"tone":"consumed"},{"start":7,"end":8,"tone":"active"}],"facts":[{"name":"slice","value":"cd","tone":"green"},{"name":"next pos","value":9,"tone":"purple"}],"action":"done","label":"Taking the final payload gives cd, and pos becomes 9. That is the end of the encoded string."}
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

## Tracing through an Example

Use a fresh example so you can watch the full encode/decode cycle without reusing the same belt from the build steps.

**Input:** `["", "code", "x#y"]`

:::trace-parse
[
{"tape":[],"facts":[{"name":"input","value":"[\"\", \"code\", \"x#y\"]","tone":"blue"}],"action":null,"label":"Start with three packages to stamp onto the shipping belt: an empty string, 'code', and 'x#y'."},
{"tape":["0","#"],"regions":[{"start":0,"end":0,"tone":"label"},{"start":1,"end":1,"tone":"separator"}],"facts":[{"name":"appended","value":"0#","tone":"green"},{"name":"belt","value":"0#","tone":"blue"}],"action":"emit","label":"The empty string becomes 0#. A zero-length package still gets a label and separator."},
{"tape":["0","#","4","#","c","o","d","e"],"regions":[{"start":0,"end":1,"tone":"consumed"},{"start":2,"end":2,"tone":"label"},{"start":3,"end":3,"tone":"separator"},{"start":4,"end":7,"tone":"payload"}],"facts":[{"name":"appended","value":"4#code","tone":"green"},{"name":"belt","value":"0#4#code","tone":"blue"}],"action":"emit","label":"Stamping 'code' adds 4#code directly after the first package."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":7,"tone":"consumed"},{"start":8,"end":8,"tone":"label"},{"start":9,"end":9,"tone":"separator"},{"start":10,"end":12,"tone":"payload"}],"facts":[{"name":"appended","value":"3#x#y","tone":"green"},{"name":"belt","value":"0#4#code3#x#y","tone":"blue"}],"action":"emit","label":"Stamping 'x#y' adds 3#x#y. The # inside the payload is just cargo, not structure."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":12,"tone":"upcoming"}],"pointers":[{"index":0,"label":"pos","tone":"blue"}],"facts":[{"name":"encoded belt","value":"0#4#code3#x#y","tone":"green"},{"name":"decoded so far","value":"[]","tone":"blue"}],"action":"scan","label":"Decoding begins at the start of the belt. pos points to the next label, not to arbitrary content."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":0,"tone":"label"},{"start":1,"end":1,"tone":"separator"},{"start":2,"end":12,"tone":"upcoming"}],"pointers":[{"index":0,"label":"pos","tone":"blue"},{"index":1,"label":"hashPos","tone":"orange"}],"facts":[{"name":"label","value":"0","tone":"blue"},{"name":"len","value":0,"tone":"green"},{"name":"start","value":2,"tone":"orange"},{"name":"slice","value":"\"\"","tone":"green"}],"action":"read","label":"Read label 0, skip the separator, and take zero characters. The first recovered package is the empty string."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":1,"tone":"consumed"},{"start":2,"end":12,"tone":"upcoming"}],"pointers":[{"index":2,"label":"pos","tone":"purple"}],"facts":[{"name":"decoded so far","value":"[\"\"]","tone":"blue"},{"name":"next pos","value":2,"tone":"purple"}],"action":"jump","label":"Advancing by exactly len lands pos at index 2, the start of the next label."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":1,"tone":"consumed"},{"start":2,"end":2,"tone":"label"},{"start":3,"end":3,"tone":"separator"},{"start":4,"end":7,"tone":"payload"},{"start":8,"end":12,"tone":"upcoming"}],"pointers":[{"index":2,"label":"pos","tone":"blue"},{"index":3,"label":"hashPos","tone":"orange"}],"facts":[{"name":"label","value":"4","tone":"blue"},{"name":"len","value":4,"tone":"green"},{"name":"start","value":4,"tone":"orange"},{"name":"slice","value":"code","tone":"green"}],"action":"take","label":"At pos = 2, the label 4 tells the decoder to take the next four characters as one package: code."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":7,"tone":"consumed"},{"start":8,"end":12,"tone":"upcoming"}],"pointers":[{"index":8,"label":"pos","tone":"purple"}],"facts":[{"name":"decoded so far","value":"[\"\", \"code\"]","tone":"blue"},{"name":"next pos","value":8,"tone":"purple"}],"action":"jump","label":"After consuming four payload characters, pos jumps to index 8, which is the next package boundary."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":7,"tone":"consumed"},{"start":8,"end":8,"tone":"label"},{"start":9,"end":9,"tone":"separator"},{"start":10,"end":12,"tone":"payload"}],"pointers":[{"index":8,"label":"pos","tone":"blue"},{"index":9,"label":"hashPos","tone":"orange"}],"facts":[{"name":"label","value":"3","tone":"blue"},{"name":"len","value":3,"tone":"green"},{"name":"start","value":10,"tone":"orange"},{"name":"slice","value":"x#y","tone":"green"}],"action":"take","label":"The final label is 3, so the decoder takes exactly three characters: x#y. The # inside that span stays part of the payload."},
{"tape":["0","#","4","#","c","o","d","e","3","#","x","#","y"],"regions":[{"start":0,"end":12,"tone":"consumed"}],"pointers":[{"index":13,"label":"pos","tone":"purple"}],"facts":[{"name":"decoded","value":"[\"\", \"code\", \"x#y\"]","tone":"green"},{"name":"next pos","value":13,"tone":"purple"}],"action":"done","label":"pos reaches the end of the belt, so decoding is complete. The recovered packages match the original input."}
]
:::

## Common Misconceptions

**"I can just join with a comma and split on commas when decoding."** — This works until any string contains a comma. The worker can't tell whether a comma is a package separator or part of the contents. Length-prefix encoding bypasses this entirely: the worker reads by count, so the contents are never parsed for structure.

**"The `#` separator could still appear inside a string and confuse the decoder."** — It can't, because the decoder never scans for `#` inside the content region. After reading a label and computing `len`, the decoder advances the cursor by exactly `len` characters. The cursor lands on the next label's first digit — and a label always starts with digits, never `#`. The only `#` the decoder ever searches for is the one that terminates the current label.

**"The decoder should find `#` by searching the entire remaining belt."** — This is correct _in combination_ with reading only up to the first `#` from the current position. `indexOf('#', pos)` finds the `#` that terminates the current label because pos always points to the start of a numeric label — the first `#` to the right of pos is always the label terminator, not a `#` inside some package's contents.

**"An empty string in the list is a problem because there's nothing to put after the `#`."** — An empty string simply gets the label `0#`. The encoder stamps `0#` on the belt; the decoder reads count=0, skips `#`, takes zero characters, and records `""` on the clipboard. Empty strings work exactly the same as any other string.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
