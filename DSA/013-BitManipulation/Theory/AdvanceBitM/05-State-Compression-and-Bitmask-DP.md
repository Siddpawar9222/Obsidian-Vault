
# Level 5: State Compression & Intro to Bitmask DP (Conceptual Overview)

> [!NOTE] What is State Compression?
> In Dynamic Programming, when you need to track **which items or graph nodes have been used/visited**:
> - Instead of a slow `boolean[]` or `HashSet` (which cannot easily serve as an array index),
> - We encode the states of up to 20 items into the bits of a single integer `mask`.
> - **Bit $i = 1$**: Item $i$ has been selected / visited.
> - **Bit $i = 0$**: Item $i$ is unselected / available.
> 
> This turns complex subset lookups into instant primitive array operations: `dp[mask]`.

---

## 1. Bitwise DP vs. Bitmask DP

| Aspect | Bitwise DP (DP on Binary Numbers) | Bitmask DP (Combinatorial Subset DP) |
| :--- | :--- | :--- |
| **What State Means** | The state $i$ is a decimal number; DP works on its binary digits. | The state `mask` represents a **subset of objects/nodes**. |
| **Typical Problems** | Number of set bits, digit DP, binary transformations. | Task assignment, Travelling Salesperson (TSP), set partitioning. |
| **Example** | [LeetCode 338: Counting Bits](https://leetcode.com/problems/counting-bits/) | [LeetCode 1986: Min Work Sessions](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) |
| **State Size** | $O(N)$ | $O(2^N)$ |

---

## 2. When to Suspect Bitmask DP in Interviews?

Look for these **three telltale clues**:

1. **Very Small $N$ ($N \le 16 \text{ to } 20$)**:
   - $2^{16} = 65,536$ states.
   - $2^{20} \approx 1,048,576$ states (fits comfortably in memory & $< 10^8$ operations).
   - If $N > 25$, Bitmask DP will TLE (exponential time); look for Greedy or Math instead.
2. **Every element must be selected or visited once** (Permutations, subsets, paths).
3. **Overlapping subproblems**: Reaching the same subset of visited elements through different orderings.

---

## 3. High-Level Transition Intuition (No Code)

- **Adding an unused element $i$ to a set**:
  - Check if unused: `(mask & (1 << i)) == 0`
  - Turn ON bit $i$: `nextMask = mask | (1 << i)`
- **Partitioning / Submask transitions**:
  - When dividing a set into valid subsets: use submask enumeration `(submask - 1) & mask`.
  - Remaining elements after taking a submask: `remaining = mask ^ submask`.

---

## 🎯 Curated Problems (For Future Reference)

Bookmark these problems to revisit when preparing for advanced DP:

| Problem | Difficulty | Core Pattern |
| :--- | :---: | :--- |
| [LeetCode 338: Counting Bits](https://leetcode.com/problems/counting-bits/) | **Easy** | **Bitwise DP**: `dp[i] = dp[i >> 1] + (i & 1)` |
| [LeetCode 1986: Min Work Sessions to Finish Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) | **Medium** | **Bitmask DP**: Partitioning tasks into sessions using submask transitions |
| [LeetCode 464: Can I Win](https://leetcode.com/problems/can-i-win/) | **Medium** | **Game Theory DP**: Tracking chosen numbers using bitmask memoization |
| [LeetCode 847: Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) | **Hard** | **BFS + Bitmask**: State is `(currentNode, visitedBitmask)` |
| [LeetCode 1125: Smallest Sufficient Team](https://leetcode.com/problems/smallest-sufficient-team/) | **Hard** | **Bitmask DP**: Skills represented as bit positions |
