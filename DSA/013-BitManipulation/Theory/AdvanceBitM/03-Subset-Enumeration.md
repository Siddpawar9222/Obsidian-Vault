---
aliases:
  - SubsetEnumeration
  - PowerSet
tags:
  - dsa
  - bit-manipulation
  - subsets
---

# Level 3: Subset Enumeration (Power Set via Bitmask)

> [!NOTE] Problem Definition
> Given an array of $n$ elements, generate all possible subsets (the **Power Set**).
> 
> For an array of size $n$, every element has exactly **two choices**:
> 1. Include the element (`1`)
> 2. Exclude the element (`0`)
> 
> Therefore, there are exactly $2^n$ unique subsets.

---

## 1. The Core Bitmask Intuition

Because each element is either selected or skipped, we can use an **$n$-bit binary number** to represent the selection state of all elements.

$$\text{Total Subsets} = 2^n = (1 \ll n)$$

We simply run a counter `mask` from `0` up to `(1 << n) - 1`. Each binary number directly maps to one subset!

### Mapping Example: `nums = [1, 2, 3]` ($n = 3$)

Here, bit $i$ corresponds to element `nums[i]`:
- Bit 0 $\rightarrow$ `nums[0]` (value `1`)
- Bit 1 $\rightarrow$ `nums[1]` (value `2`)
- Bit 2 $\rightarrow$ `nums[2]` (value `3`)

| Mask (Decimal) | Binary Mask (`b2 b1 b0`) | Included Elements | Generated Subset |
| :---: | :---: | :---: | :--- |
| **0** | `0 0 0` | None | `[]` |
| **1** | `0 0 1` | `nums[0]` | `[1]` |
| **2** | `0 1 0` | `nums[1]` | `[2]` |
| **3** | `0 1 1` | `nums[0], nums[1]` | `[1, 2]` |
| **4** | `1 0 0` | `nums[2]` | `[3]` |
| **5** | `1 0 1` | `nums[0], nums[2]` | `[1, 3]` |
| **6** | `1 1 0` | `nums[1], nums[2]` | `[2, 3]` |
| **7** | `1 1 1` | `nums[0], nums[1], nums[2]` | `[1, 2, 3]` |

Every integer from $0$ to $7$ generates a distinct subset with zero recursion!
 
[LeetCode 78: Subsets](https://leetcode.com/problems/subsets/)

## 3. Complexity Analysis

- **Time Complexity**: $O(n \cdot 2^n)$
  - Outer loop runs $2^n$ times.
  - Inner loop checks $n$ bits for each mask.
  - Creating and copying each subset takes $O(n)$ time.
- **Space Complexity**: $O(1)$ auxiliary space
  - Unlike recursion/backtracking, there is **no recursive call stack**. Memory is only used for the returned subsets.

---

## 4. Bitmasking vs. Backtracking Comparison

| Dimension | Bitmask Iteration | Backtracking (Recursion) |
| :--- | :--- | :--- |
| **Approach** | Purely iterative (nested loop) | Recursive DFS tree |
| **Call Stack Memory** | $O(1)$ auxiliary | $O(n)$ recursion stack |
| **Order of Subsets** | Ordered by binary numbers ($0 \rightarrow 2^n-1$) | Depth-first search tree order |
| **Pruning Capability** | Difficult (must generate every mask) | Easy (can prune branches early) |
| **Duplicate Elements** | Harder to handle cleanly (requires hashing or extra logic) | Natural to handle with `sort` and skip: `nums[i] == nums[i-1]` |
| **Input Size Limit** | Up to $n \le 30$ (fits in `int` / `long`) | Usually $n \le 20$ (due to exponential growth) |

---

## 📝 Practice & Revision Checklist

- [x] What is the range of masks for an array of size $n$? *(Answer: `0` to `(1 << n) - 1`)*.
- [x] How do you test if element at index `i` is included in `mask`? *(Answer: `(mask & (1 << i)) != 0`)*.
- [x] [LeetCode 78: Subsets](https://leetcode.com/problems/subsets/)
- [x] [LeetCode 90: Subsets II](https://leetcode.com/problems/subsets-ii/) (Handling duplicates)

