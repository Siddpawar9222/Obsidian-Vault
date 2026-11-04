---
aliases:
  - SubmaskEnumeration
tags:
  - dsa
  - bit-manipulation
  - submasks
---

# Level 4: Submask Enumeration (Subsets of a Mask)

> [!NOTE] Definition: What is a Submask?
> Given a bitmask $M$, a **submask** $S$ is a mask whose set bits are a **subset of the set bits of $M$**.
> 
> Mathematically:
> $$(S \ \& \ M) == S \quad \text{or} \quad (S \ \& \ \sim M) == 0$$
> 
> If $M$ has $k$ set bits, it has exactly **$2^k$ valid submasks**.

---

## 1. Concrete Example: Submasks of `11` (`1011_2`)

Consider `mask = 11` (binary `1011`).
Bits at positions **3, 1, and 0** are set ($k = 3$ set bits).
Therefore, there are $2^3 = 8$ valid submasks:

| Submask (Decimal) | Binary Representation | Active Bits (from $\{3, 1, 0\}$) | Valid Submask? |
| :---: | :---: | :---: | :---: |
| **11** | `1011` | Bits 3, 1, 0 | ✅ Yes (Full mask) |
| **10** | `1010` | Bits 3, 1 | ✅ Yes |
| **9** | `1001` | Bits 3, 0 | ✅ Yes |
| **8** | `1000` | Bit 3 | ✅ Yes |
| **3** | `0011` | Bits 1, 0 | ✅ Yes |
| **2** | `0010` | Bit 1 | ✅ Yes |
| **1** | `0001` | Bit 0 | ✅ Yes |
| **0** | `0000` | None | ✅ Yes (Empty mask) |

Notice that numbers like `4` (`0100`), `5` (`0101`), `6` (`0110`), and `7` (`0111`) are **not valid submasks** because bit 2 is set in them, but bit 2 is NOT set in `1011`.

---

## 2. The Naive vs Optimal Approach

### The Naive Way (Slow)
```java
// Terrible if mask has few set bits but a high value
for (int s = mask; s >= 0; s--) {
    if ((s & mask) == s) {
        // valid submask
    }
}
```
If `mask = 1 << 20` (has only 1 set bit, so only 2 submasks), the naive loop checks over **1 million numbers** unnecessarily!

### The Optimal Trick (Instant $O(1)$ Hop)
```java
submask = (submask - 1) & mask;
```
This formula **skips every invalid number** and jumps directly to the next smaller valid submask in a single step!

---

## 3. Why `(submask - 1) & mask` Works (Under the Hood)

Let's understand why subtracting 1 followed by ANDing with `mask` produces the exact next valid submask:

1. **`submask - 1`**:
   - Flips the rightmost set bit in `submask` to `0`.
   - Flips all zeroes to the right of it to `1`s.
2. **`& mask`**:
   - Keeps only the bits that were originally present in `mask`.
   - Strips away all newly created `1`s that do not belong to `mask`.

### Walkthrough: Transition from `8` to `3` in `mask = 1011`
Watch how the formula effortlessly skips invalid numbers `7`, `6`, `5`, and `4`:

```text
Current submask = 8:         1000
Subtract 1:                - 0001
---------------------------------
submask - 1     = 7:         0111   (Notice: bits 2, 1, 0 became 1)

Now AND with original mask:
  (submask - 1) =            0111
& mask (11)     =          & 1011
---------------------------------
Next submask    = 3:         0011   (Bit 2 was stripped out because mask doesn't have it!)
```

In a single operation, `8` transitioned directly to `3`!

---

## 4. Full Dry-Run Trace Table (`mask = 11`)

$$\text{Original Mask} = 1011_2 \ (11)$$

| Step | Current `submask` | `submask - 1` (Binary) | `(submask - 1) & mask` (Binary) | Next `submask` | Skipped Invalid Numbers |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **11** (`1011`) | `10` (`1010`) | `1010 & 1011 = 1010` | **10** | None |
| **2** | **10** (`1010`) | `9` (`1001`) | `1001 & 1011 = 1001` | **9** | None |
| **3** | **9** (`1001`) | `8` (`1000`) | `1000 & 1011 = 1000` | **8** | None |
| **4** | **8** (`1000`) | `7` (`0111`) | `0111 & 1011 = 0011` | **3** | **Skipped 7, 6, 5, 4** |
| **5** | **3** (`0011`) | `2` (`0010`) | `0010 & 1011 = 0010` | **2** | None |
| **6** | **2** (`0010`) | `1` (`0001`) | `0001 & 1011 = 0001` | **1** | None |
| **7** | **1** (`0001`) | `0` (`0000`) | `0000 & 1011 = 0000` | **0** | None |

Total submasks generated: **8** (all perfectly valid, in strictly descending order).

---

## 5. Standard Java Templates

### Template A: Common Loop (Processes Non-Zero Submasks + Handles Zero)
```java
int mask = 11; // e.g. 1011

for (int submask = mask; submask > 0; submask = (submask - 1) & mask) {
    // Process submask (11, 10, 9, 8, 3, 2, 1)
    System.out.println(submask);
}
// Handle empty submask 0 separately if needed
System.out.println(0);
```

### Template B: Do-While Loop (Includes `0` Automatically)
```java
int mask = 11;
int submask = mask;

do {
    // Process submask (covers all from mask down to 0)
    System.out.println(submask);
    
    submask = (submask - 1) & mask;
} while (submask != mask); // When submask = 0, (0 - 1) & mask wraps back to mask!
```

> [!TIP] Why the Do-While Loop Terminates
> When `submask == 0`, `0 - 1 = -1` (all 32 bits are `1`). 
> Then `-1 & mask` equals `mask`. The loop condition `submask != mask` detects this wrap-around and terminates!

---

## 6. Time Complexity Proof: Why Iterating Over All Submasks is $O(3^n)$

A common interview question:
> *"If we iterate over all $2^n$ masks, and for each mask we iterate over all its submasks, what is the total time complexity?"*

Many candidates wrongly guess $O(4^n)$ or $O(2^n \cdot 2^n)$. The true complexity is **$O(3^n)$**!

### Mathematical Proof via Binomial Theorem:
- A mask of size $n$ with $k$ set bits has $\binom{n}{k}$ combinations.
- Each such mask has $2^k$ submasks.
- Summing over all possible values of $k$ from $0$ to $n$:

$$\sum_{k=0}^{n} \binom{n}{k} 2^k \cdot 1^{n-k} = (2 + 1)^n = 3^n$$

### Practical Impact
| $n$ | $2^n$ (Masks) | $3^n$ (All Submasks) | $4^n$ (Naive guess) |
| :-: | :-: | :-: | :-: |
| **10** | $1,024$ | $59,049$ | $1,048,576$ |
| **15** | $32,768$ | **$14.3 \times 10^6$** (Passes in $<0.1$s) | $1.07 \times 10^9$ (Times out TLE) |

---

## 📝 Practice & Revision Checklist

- [x] What is the mathematical definition of a submask? *(Answer: `(s & mask) == s`)*.
- [x] What does `(submask - 1) & mask` do? *(Answer: Jump to the next smaller valid submask in $O(1)$)*.
- [x] Why is iterating all submasks of all masks $O(3^n)$ instead of $O(4^n)$?
- [x] [LeetCode 1986: Minimum Number of Work Sessions to Finish Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) (Uses submask enumeration transition).

