Complete DSA Learning Path: Novice → Expert

---

## Philosophy

This curriculum is designed with **pedagogical progression** in mind:

- **Early steps** build problem-solving intuition with simpler structures
- **Middle steps** introduce algorithmic thinking and complexity
- **Late steps** combine everything into advanced problem-solving

Each phase has a purpose beyond just "learning a data structure."

### How It Works

Every step is split into two tiers:

- **Practice** — Do these when you first hit the step. Mostly easy, 1-2 mediums. Goal: understand the pattern, build the mental model, get a win. Move on after this.
- **Revisit** — Return to these after completing 1-2 more steps. These deepen the pattern, expose edge cases, and build the fluency you'll need in interviews.

Don't try to finish **Revisit** before moving to the next step. Forward momentum matters.

---

## 🌱 Phase 1: Novice

**Goal**: Build foundational problem-solving intuition with linear structures.

### Why Start Here?

- Arrays/strings are intuitive (you can visualize them)
- Teaches loop thinking and index manipulation
- Low cognitive overhead - focus on _problem-solving_ not _data structure complexity_
- Builds confidence with early wins

---

### Step 1: Arrays & Strings

**What You Learn**:

- Index manipulation
- Iteration patterns (forward, backward, both)
- In-place modifications
- String immutability handling

**Practice** _(do these now — get the basics, build confidence)_:

- [x] Reverse array
- [x] [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- [x] [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
- [x] [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

**Revisit** _(return to after Hash Maps — these use concepts from the next step)_:

- [x] [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
- [x] [271. Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) _(Premium)_

**Why First**: Most fundamental structure. You need comfort here before anything else.

---

### Step 2: Hash Maps & Hash Sets

**What You Learn**:

- O(1) lookup power
- Trading space for time
- Frequency counting patterns
- Fast duplicate detection

**Practice** _(do these now)_:

- [x] [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)
- [x] [387. First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/)
- [x] [1. Two Sum](https://leetcode.com/problems/two-sum/)
- [x] [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)

**Revisit** _(return to after Two Pointers)_:

- [x] [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/)
- [x] [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)
- [x] [36. Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) _(combines 2D arrays + hash sets — do this one here, not in the Arrays step)_

**Why Now**: Essential tool you'll use EVERYWHERE. Learn it early so it's second nature.

---

### Step 3: Two Pointers

**What You Learn**:

- Multiple iteration variables
- Converging/diverging patterns
- In-place array manipulation
- Optimization thinking

**Practice** _(do these now)_:

- [x] [27. Remove Element](https://leetcode.com/problems/remove-element/)
- [ ] [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [x] [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
- [ ] [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) _(two pointers: L=cheapest buy day, R=current day — greedy in spirit but naturally framed with two pointers)_

**Revisit** _(return to after Sliding Window)_:

- [x] [75. Sort Colors](https://leetcode.com/problems/sort-colors/)
  - This one still stumped me initially, I had to resort to visual guide, but I mostly got it, will come back
- [x] [15. 3Sum](https://leetcode.com/problems/3sum/)
- [ ] [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) _(★ challenge — significantly harder, treat as a bonus)_

**Why Now**: First real "technique" - teaches you that problems have patterns beyond brute force.

---

### Step 4: Sliding Window

**What You Learn**:

- Window state management
- Expand/contract logic
- Optimization of brute force
- Substring/subarray patterns

**Practice** _(do these now)_:

- [x] Max sum subarray of size K _(fixed-size window — the simplest possible sliding window, do this first)_
- [x] [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

**Revisit** _(return to after Linked Lists)_:

- [x] [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)
- [ ] [424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)
- [x] [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)
- [ ] [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) _(requires deque — a step up in complexity)_

**Why Now**: Natural extension of two pointers. Solidifies the idea that technique matters.

---

### Step 5: Linked Lists

**What You Learn**:

- Pointer manipulation
- Node-based thinking
- Reference vs value
- Edge case handling (null checks)

**Practice** _(do these now)_:

- [x] [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- [x] [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)
- [x] [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Revisit** _(return to after Stack & Queue)_:

- [ ] [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) _(do this right after #141 — same Floyd's cycle detection idea, applied to an array)_
- [x] [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
- [ ] [143. Reorder List](https://leetcode.com/problems/reorder-list/)
- [ ] [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)
- [ ] [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/)
- [ ] [146. LRU Cache](https://leetcode.com/problems/lru-cache/)
- [ ] [25. Reverse Nodes in K-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) _(★ challenge)_

**Why Now**: First non-array structure. Teaches pointer thinking which is crucial for trees/graphs later.

---

### Step 6: Stack & Queue

**What You Learn**:

- LIFO vs FIFO thinking
- When order matters
- Auxiliary data structures
- Pairing/matching problems

**Practice** _(do these now)_:

- [x] [232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) _(understanding LIFO vs FIFO by building)_
- [x] [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- [x] [155. Min Stack](https://leetcode.com/problems/min-stack/)
- [ ] [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)

**Revisit** _(return to after Binary Search — these introduce monotonic stack, a new idea)_:

- [x] [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
- [ ] [853. Car Fleet](https://leetcode.com/problems/car-fleet/)
- [ ] [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) _(★ challenge)_

**Why Now**: These patterns appear everywhere. Also critical for understanding recursion call stack.

---

### Step 7: Recursion & Backtracking Intro

**What You Learn**:

- Breaking problems into subproblems
- Base case thinking
- Call stack mental model
- Trust the recursion

**Practice** _(do these now — in this exact order)_:

- [x] Factorial _(simplest recursion: one base case, one recursive call)_
- [x] [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)
- [x] [78. Subsets](https://leetcode.com/problems/subsets/) _(first backtracking: pure include/exclude, no constraints)_

**Revisit** _(return to after Binary Search)_:

- [x] [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) _(adds constraint logic on top of subsets thinking)_

**Why Now**: CRITICAL checkpoint. You cannot progress without recursion. Take your time here.

---

### Step 8: Binary Search

**What You Learn**:

- Divide and conquer thinking
- Search space reduction
- Template-based problem solving
- Log(n) complexity benefits

**Practice** _(do these now — nail the template before varying it)_:

- [x] [704. Binary Search](https://leetcode.com/problems/binary-search/)
- [x] [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- [ ] [278. First Bad Version](https://leetcode.com/problems/first-bad-version/)
- [ ] [374. Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/)

**Revisit** _(return to after Binary Trees — ordered by concept jump)_:

- [x] [74. Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)
- [ ] [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)
- [x] [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)
- [x] [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
- [ ] [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [ ] [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [ ] [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)
- [ ] [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/)
- [ ] [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) _(★ challenge — significantly harder than everything above)_

**Why Now**: First logarithmic algorithm. Introduces the idea that clever algorithms beat brute force.

---

## 🎓 Checkpoint: Novice → Studied

**You should now be able to**:
✅ Solve easy problems confidently (70%+ success rate)
✅ Recognize when to use hash map vs two pointers vs sliding window
✅ Write recursive solutions
✅ Understand time/space complexity
✅ Think about optimization

---

## 📚 Phase 2: Studied

**Goal**: Master hierarchical structures and graph algorithms. Develop pattern recognition.

### Why This Phase?

- Trees introduce hierarchical thinking (prerequisite for graphs)
- Graphs are the most complex structure - need strong foundation first
- Dynamic programming requires seeing overlapping subproblems
- You now have the tools (recursion, hash maps, etc.) to handle complexity

---

### Step 9: Binary Trees

**What You Learn**:

- Hierarchical data structures
- Tree traversals (pre/in/post-order)
- Recursive tree thinking
- Level-order traversal (BFS intro)

**Practice** _(do these now — DFS on trees before BFS)_:

- [x] [226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)
- [x] [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- [x] [100. Same Tree](https://leetcode.com/problems/same-tree/)
- [x] [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)

**Revisit** _(return to after BST — ordered: validation → BFS intro → combining subtrees → hard)_:

- [x] [110. Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)
- [x] [572. Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/)
- [ ] [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [ ] [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)
- [ ] [1448. Count Good Nodes in Binary Tree](https://leetcode.com/problems/count-good-nodes-in-binary-tree/)
- [ ] [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
- [ ] [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- [ ] [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
- [ ] [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

**Why Now**: Trees are "training wheels" for graphs. Easier to visualize, no cycles, simpler rules.

---

### Step 10: Binary Search Trees

**What You Learn**:

- Ordered structures
- BST property
- In-order traversal gives sorted order
- Validation patterns

**Practice** _(do these now — learn BST by inserting before validating)_:

- [x] [701. Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/)
- [x] [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Revisit** _(return to after Heaps)_:

- [ ] [230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
- [ ] [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

**Why Now**: Extends tree knowledge with ordering property. Common in interviews.

---

### Step 11: Heaps & Priority Queues

**What You Learn**:

- Maintaining order dynamically
- K-way problems
- Top K patterns
- O(log n) insertions

**Practice** _(do these now — max heap then min heap, then combine)_:

- [x] [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) _(pure max heap — simplest mental model)_
- [x] [703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) _(min heap to track top K)_
- [x] [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Revisit** _(return to after Graph Fundamentals)_:

- [ ] [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)
- [ ] [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
- [ ] [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/)
- [ ] [355. Design Twitter](https://leetcode.com/problems/design-twitter/)
- [ ] [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)
- [ ] [23. Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) _(★ challenge — heap + linked lists)_

**Why Now**: Powerful data structure. Often combined with graphs later (Dijkstra).

---

### Step 12: Graphs — Fundamentals

**What You Learn**:

- Graph representation (adjacency list/matrix)
- Directed vs undirected
- Weighted vs unweighted
- Identifying graph problems

**Practice** _(do these now — grid-based graphs first, adjacency list second)_:

- [x] [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
- [x] [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/)
- [x] [133. Clone Graph](https://leetcode.com/problems/clone-graph/)

**Revisit** _(return to after Graph DFS)_:

- [ ] [323. Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) _(Premium)_
- [ ] [261. Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) _(Premium)_

**Why Now**: You finally have recursion, trees, and hash maps mastered. Ready for the complexity.

---

### Step 13: Graph Traversal — DFS

**What You Learn**:

- Depth-first exploration
- Backtracking in graphs
- Cycle detection
- Path finding

**Practice** _(do these now — simple DFS before cycle detection)_:

- [ ] [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/)
- [ ] [797. All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/)
- [ ] [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

**Revisit** _(return to after Graph BFS)_:

- [ ] [130. Surrounded Regions](https://leetcode.com/problems/surrounded-regions/)
- [ ] [417. Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)

**Why Now**: After trees, DFS on graphs is natural. You already know recursion deeply.

---

### Step 14: Graph Traversal — BFS

**What You Learn**:

- Breadth-first exploration
- Shortest path in unweighted graphs
- Level-by-level processing
- Multi-source BFS

**Practice** _(do these now — grid BFS before multi-source)_:

- [ ] [1091. Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)
- [ ] [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
- [ ] [286. Walls and Gates](https://leetcode.com/problems/walls-and-gates/) _(Premium — multi-source BFS, belongs here not in DFS)_

**Revisit** _(return to after Advanced Graphs)_:

- [ ] [127. Word Ladder](https://leetcode.com/problems/word-ladder/) _(★ challenge — BFS with string transformation)_

**Why Now**: After DFS, BFS is just "using a queue instead of recursion."

---

### Step 15: Advanced Graph Algorithms

**What You Learn**:

- Topological sort (DFS + BFS approaches)
- Union Find / Disjoint Set
- Minimum spanning tree
- Shortest path (Dijkstra, Bellman-Ford)

**Practice** _(do these now — topo sort → union find → Dijkstra)_:

- [ ] [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)
- [ ] [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
- [ ] [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Revisit** _(return to after Backtracking)_:

- [ ] [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
- [ ] [332. Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/)
- [ ] [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
- [ ] [778. Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/)
- [ ] [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) _(Premium)_

**Why Now**: Combines everything. You're ready for these complex algorithms.

---

### Step 16: Backtracking Deep Dive

**What You Learn**:

- State space tree exploration
- Pruning strategies
- Constraint satisfaction
- Combinatorial generation

**Practice** _(do these now — basic combinations before constrained ones)_:

- [ ] [77. Combinations](https://leetcode.com/problems/combinations/) _(pure combinations — no constraints, clearest intro)_
- [ ] [39. Combination Sum](https://leetcode.com/problems/combination-sum/)
- [ ] [46. Permutations](https://leetcode.com/problems/permutations/)

**Revisit** _(return to after DP 1D)_:

- [ ] [90. Subsets II](https://leetcode.com/problems/subsets-ii/)
- [ ] [40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)
- [ ] [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)
- [ ] [79. Word Search](https://leetcode.com/problems/word-search/)
- [ ] [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)
- [ ] [51. N-Queens](https://leetcode.com/problems/n-queens/) _(★ challenge)_
- [ ] [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) _(★ challenge)_

**Why Now**: Advanced recursion. Requires strong foundation + graph DFS understanding.

---

### Step 17: Dynamic Programming — 1D

**What You Learn**:

- Overlapping subproblems
- Memoization vs tabulation
- State definition
- Recurrence relations

**Practice** _(do these now — Fibonacci-like problems before decision DP)_:

- [ ] [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
- [ ] [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)
- [ ] [198. House Robber](https://leetcode.com/problems/house-robber/)

**Revisit** _(return to after DP 2D — in difficulty order)_:

- [ ] [213. House Robber II](https://leetcode.com/problems/house-robber-ii/)
- [ ] [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)
- [ ] [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)
- [ ] [91. Decode Ways](https://leetcode.com/problems/decode-ways/)
- [ ] [322. Coin Change](https://leetcode.com/problems/coin-change/)
- [ ] [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)
- [ ] [139. Word Break](https://leetcode.com/problems/word-break/)
- [ ] [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
- [ ] [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Why Now**: Hardest paradigm. Needs strong recursion + pattern recognition from earlier phases.

---

### Step 18: Dynamic Programming — 2D

**What You Learn**:

- Multi-dimensional state
- Grid DP
- String DP
- Optimization

**Practice** _(do these now — grid DP → classic string DP)_:

- [ ] [62. Unique Paths](https://leetcode.com/problems/unique-paths/)
- [ ] [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)
- [ ] [518. Coin Change II](https://leetcode.com/problems/coin-change-ii/)

**Revisit** _(return to after Greedy)_:

- [ ] [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
- [ ] [494. Target Sum](https://leetcode.com/problems/target-sum/)
- [ ] [97. Interleaving String](https://leetcode.com/problems/interleaving-string/)
- [ ] [329. Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)
- [ ] [115. Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/)
- [ ] [72. Edit Distance](https://leetcode.com/problems/edit-distance/)
- [ ] [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) _(★ challenge)_
- [ ] [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) _(★ challenge)_

**Why Now**: After 1D DP, extending to 2D is conceptual, not fundamentally new.

---

## 🎓 Checkpoint: Studied → Expert

**You should now be able to**:
✅ Solve most medium problems (60-70% success rate)
✅ Recognize graph patterns immediately
✅ Choose between DFS/BFS appropriately
✅ Identify DP problems and define states
✅ Handle complex backtracking problems
✅ Understand advanced algorithms (topological sort, Dijkstra, etc.)

---

## 🎯 Phase 3: Expert

**Goal**: Combine techniques, optimize solutions, tackle hard problems.

---

### Step 19: Greedy Algorithms

**What You Learn**:

- Local optimal choices leading to global optimal
- Sorting as a preprocessing step
- Interval-based thinking
- When greedy works vs when you need DP

**Practice** _(do these now — Kadane's → reachability greedy)_:

- [ ] [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
- [ ] [55. Jump Game](https://leetcode.com/problems/jump-game/)
- [ ] [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/)

**Revisit** _(return to after Intervals)_:

- [ ] [134. Gas Station](https://leetcode.com/problems/gas-station/)
- [ ] [846. Hand of Straights](https://leetcode.com/problems/hand-of-straights/)
- [ ] [1899. Merge Triplets to Form Target Triplet](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/)
- [ ] [763. Partition Labels](https://leetcode.com/problems/partition-labels/)
- [ ] [678. Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string/)

**Why Now**: Greedy requires strong intuition about when local choices are globally optimal - something you build through DP and backtracking.

---

### Step 20: Intervals

**What You Learn**:

- Interval sorting and merging patterns
- Sweep line technique
- Overlap detection
- Meeting room scheduling

**Practice** _(do these now — simple overlap check before merging)_:

- [ ] [252. Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) _(Premium — simplest interval problem: just check for overlap)_
- [ ] [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)
- [ ] [57. Insert Interval](https://leetcode.com/problems/insert-interval/)

**Revisit** _(return to after Tries)_:

- [ ] [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)
- [ ] [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) _(Premium)_
- [ ] [1851. Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query/)

**Why Now**: Interval problems combine sorting with greedy thinking - both skills you've built by now.

---

### Step 21: Tries

**What You Learn**:

- Prefix-based data structures
- Character-by-character traversal
- Efficient string search
- Autocomplete patterns

**Practice** _(do these now)_:

- [ ] [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [ ] [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

**Revisit** _(return to after Math & Geometry)_:

- [ ] [212. Word Search II](https://leetcode.com/problems/word-search-ii/) _(★ challenge — Trie + backtracking combined)_

**Why Now**: Combines tree structure knowledge with string processing.

---

### Step 22: Math & Geometry

**What You Learn**:

- Matrix manipulation patterns
- In-place transformations
- Mathematical reasoning in code
- Coordinate geometry

**Practice** _(do these now — simple math before matrix manipulation)_:

- [ ] [66. Plus One](https://leetcode.com/problems/plus-one/)
- [ ] [202. Happy Number](https://leetcode.com/problems/happy-number/)
- [ ] [48. Rotate Image](https://leetcode.com/problems/rotate-image/)

**Revisit** _(return to after Bit Manipulation)_:

- [ ] [54. Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)
- [ ] [73. Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/)
- [ ] [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)
- [ ] [43. Multiply Strings](https://leetcode.com/problems/multiply-strings/)
- [ ] [2013. Detect Squares](https://leetcode.com/problems/detect-squares/)

**Why Now**: These problems test implementation precision and mathematical thinking - good to practice after mastering algorithmic patterns.

---

### Step 23: Bit Manipulation

**What You Learn**:

- Binary representation
- XOR, AND, OR, shift operations
- Bit masking techniques
- Space-efficient solutions

**Practice** _(do these now — XOR properties first)_:

- [ ] [136. Single Number](https://leetcode.com/problems/single-number/)
- [ ] [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)
- [ ] [338. Counting Bits](https://leetcode.com/problems/counting-bits/)

**Revisit** _(return to during final review)_:

- [ ] [190. Reverse Bits](https://leetcode.com/problems/reverse-bits/)
- [ ] [268. Missing Number](https://leetcode.com/problems/missing-number/)
- [ ] [7. Reverse Integer](https://leetcode.com/problems/reverse-integer/)
- [ ] [371. Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/)

**Why Now**: Bit manipulation is a distinct skill set. Best tackled once you're comfortable with all other patterns.

---

## 🎓 Checkpoint: Expert

**You should now be able to**:
✅ Solve hard problems with structured approaches
✅ Combine multiple patterns in a single solution
✅ Recognize greedy vs DP trade-offs
✅ Implement advanced data structures from scratch
✅ Handle all common interview problem types with confidence

---

## 🚀 Advanced Topics

**Advanced DP**:

- Knapsack variations
- DP on trees
- Bitmask DP
- DP with optimization

**Advanced Graph**:

- Strongly connected components
- Bridges and articulation points
- Minimum cut
- Network flow

**System Design**:

- LFU Cache
- Design search autocomplete

---

## 💡 Key Principles

### 1. **Depth over Breadth**

Spend real time truly mastering simple topics before advancing. Don't rush.

### 2. **Spaced Repetition**

Revisit earlier steps. After learning graphs, go back and solve tree problems - they'll seem trivial.

### 3. **Build, Don't Memorize**

Understand WHY each technique works. The pattern recognition comes naturally.

### 4. **Progressive Difficulty**

Each step is slightly harder than the last, but builds on previous knowledge.

### 5. **Trust the Process**

- Steps 1–3: "This seems manageable"
- Steps 4–7: "This is getting hard" (Recursion + Trees)
- Steps 8–13: "This is really challenging" (Graphs + DFS/BFS)
- Steps 14–18+: "Wait, this is starting to click" (DP + Advanced topics)

Complex topics need time to sink in. Don't rush DP just because you've done the earlier steps.

---

## 📖 How to Use This Guide

1. **Don't skip around**: The order matters
2. **Do the Practice problems first**: Finish all Practice problems before moving to Revisit
3. **Practice consistently**: Focused hours > distracted hours
   - Take breaks regularly
   - Quality study time matters more than quantity
   - Some days will feel slower - that's the learning process
4. **Review regularly**: Revisit old steps every week
5. **Build projects**: Implement data structures from scratch
6. **Join communities**: Discuss problems, learn from others

---

## 🎓 Final Thought

This path takes real commitment to reach "Studied" level. That's normal — companies like Google expect candidates to have spent months preparing. The key is:

✅ **Consistency** over intensity
✅ **Understanding** over memorization (why it works, not just how)
✅ **Patience** with the process (slow days happen, keep going)
✅ **Confidence** that each step builds on the last (it compounds!)

You're not just learning algorithms — you're rewiring how you think about problems.

**Trust the process. You'll get there.**
