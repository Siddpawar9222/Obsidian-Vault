# Single Element Problems (Bit Manipulation Guide)

A beginner-friendly guide to solving all three classic **"Single Number"** problems using pure bit manipulation concepts without extra memory.

---

## At a Glance: Problem Comparison

| Problem | Duplicate Frequency | Unique Elements | Core Bit Trick | Time Complexity | Space Complexity |
| :--- | :---: | :---: | :--- | :---: | :---: |
| **Single Number I** | $2\times$ | $1$ | XOR all numbers ($a \oplus a = 0$) | $O(n)$ | $O(1)$ |
| **Single Number II** | $3\times$ | $1$ | Count bits position-by-position ($\text{sum} \pmod 3$) | $O(n)$ | $O(1)$ |
| **Single Number III** | $2\times$ | $2$ | XOR all $\rightarrow$ Partition into 2 groups using rightmost set bit | $O(n)$ | $O(1)$ |

---

## 1. Single Number I: Unique Element with Duplicates Appearing Twice

> **Problem:** Every element appears **twice**, except for **one** element that appears only once. Find it.

### Core Intuition: XOR Cancellation

XOR ($\oplus$) has two fundamental rules:
1. **Identical numbers cancel out to zero:**  
   $$a \oplus a = 0$$
2. **Any number XORed with zero stays unchanged:**  
   $$a \oplus 0 = a$$
3. **Order does not matter:**  
   $$(a \oplus b \oplus a) = (a \oplus a) \oplus b = 0 \oplus b = b$$

### How It Works

XOR every number in the array together in a single pass:
- All duplicate pairs cancel each other out ($a \oplus a = 0$).
- The only number left at the end is the unique single element.

---

## 2. Single Number II: Unique Element with Duplicates Appearing Three Times

> **Problem:** Every element appears **three times**, except for **one** element that appears only once. Find it.

### Why Simple XOR Fails

In this problem, duplicates appear 3 times instead of 2:
$$a \oplus a \oplus a = (a \oplus a) \oplus a = 0 \oplus a = a$$

Because 3 copies leave the number unchanged instead of canceling out, a single XOR pass cannot isolate the unique value.

---

### The Core Idea: Count Bits Modulo 3

Instead of processing entire numbers, look at each of the **32 bit positions** independently (from bit 0 to bit 31):

1. **Triplets contribute multiples of 3:**  
   If a number appears 3 times, each `1` bit in its binary form appears 3 times ($3, 6, 9, \dots$).
2. **The unique number contributes exactly 1:**  
   It adds $1$ only at its own set bit positions.
3. **Cancel triplets using Modulo 3 (`% 3`):**
   - If the sum of `1`s at a bit position is a multiple of 3 $\rightarrow$ `sum % 3 = 0` (comes only from triplets).
   - If the sum is not a multiple of 3 $\rightarrow$ `sum % 3 = 1` (comes from the unique number).

Reconstructing the bits where `sum % 3 == 1` gives the exact unique number.

---

### Step-by-Step Example

Consider: `nums = [2, 2, 3, 2]`

- `2` in binary: `0 0 1 0`
- `2` in binary: `0 0 1 0`
- `3` in binary: `0 0 1 1`
- `2` in binary: `0 0 1 0`

| Bit Position | Total `1`s Count | `Count % 3` | Resulting Bit | Explanation |
| :---: | :---: | :---: | :---: | :--- |
| **Bit 3** | $0$ | $0$ | `0` | No number has this bit set |
| **Bit 2** | $0$ | $0$ | `0` | No number has this bit set |
| **Bit 1** | $4$ | **$1$** | `1` | Three `1`s from `2`s (canceled by `% 3`) + one `1` from `3` |
| **Bit 0** | $1$ | **$1$** | `1` | One `1` from `3` |

Resulting binary: `0011` $\implies$ **`3`**.

> [!NOTE]
> **Handles Negative Numbers Automatically:**  
> In computers, negative numbers are stored in 32-bit Two's Complement. The 31st bit (the sign bit) is processed by the exact same modulo-3 logic, correctly preserving negative signs.

---

## 3. Single Number III: Two Unique Elements with Duplicates Appearing Twice

> **Problem:** Every element appears **twice**, except for **two** unique elements ($a$ and $b$) that appear only once. Find both.

### The Challenge: Global XOR Combines Both Numbers

If we XOR all elements in the array:
- All duplicate pairs cancel out.
- We are left with:
  $$\text{XOR Result} = a \oplus b$$

For example, if `nums = [1, 2, 1, 3, 2, 5]`:
$$(1 \oplus 1) \oplus (2 \oplus 2) \oplus (3 \oplus 5) = 0 \oplus 0 \oplus (3 \oplus 5) = 3 \oplus 5 = 6$$

In binary:
- $3 = 0011_2$
- $5 = 0101_2$
- $3 \oplus 5 = 0110_2$ (decimal $6$)

We have `6`, but we need to extract `3` and `5` separately.

---

### The Key Insight: Find a Differentiating Bit

A bit is set to `1` in $a \oplus b$ **only if** $a$ and $b$ have different bits at that position (one has `1`, the other has `0`).

In $3 \oplus 5 = 0110_2$:
- **Bit 1** is `1`: Number `3` has a `1` here, while number `5` has a `0`.
- This bit acts as a **separator** to divide all numbers into two distinct groups!

---

### The Trick to Isolate the Rightmost Set Bit: `xor & (-xor)`

To pick the lowest set bit from the combined XOR:
$$\text{mask} = \text{xor} \ \& \ (-\text{xor})$$

**Why this works (Two's Complement):**
- Negating a number (`-xor`) flips all bits and adds 1.
- Inverting flips everything, and adding 1 ripples up to the first set bit.
- Performing `&` leaves only that single rightmost set bit intact.

```text
xor       =  0110
-xor      =  1010
-----------------
xor & -xor = 0010  (decimal 2)
```

---

### Partition into Two Groups and Cancel Again

Using our mask `0010` (decimal `2`), check each number in the array:
- **Group A (Bit is 1):** `(num & mask) != 0`
- **Group B (Bit is 0):** `(num & mask) == 0`

| Number | Binary | `num & 2` | Assigned Group |
| :---: | :---: | :---: | :---: |
| **1** | `0001` | $0$ | **Group B** |
| **2** | `0010` | $2$ | **Group A** |
| **1** | `0001` | $0$ | **Group B** |
| **3** | `0011` | $2$ | **Group A** (contains 3) |
| **2** | `0010` | $2$ | **Group A** |
| **5** | `0101` | $0$ | **Group B** (contains 5) |

**Why this guarantees the solution:**
1. **Duplicates always stay together:** Both copies of `1` go to Group B; both copies of `2` go to Group A. Inside each group, duplicate pairs cancel out via XOR!
2. **The two unique numbers are separated:** `3` goes to Group A, and `5` goes to Group B.
3. XORing all elements in Group A yields **`3`**.
4. XORing all elements in Group B yields **`5`**.

---

## 4. Summary: 3-Step Mental Framework for Interviews

When faced with a "Single Number" variant, follow this progression:

```text
Are duplicates paired (2x)?
 ├── Exactly 1 unique? ──► Single XOR pass (all pairs cancel to 0).
 └── Exactly 2 unique? ──► 1. XOR all to get (a ^ b).
                           2. Find differing bit via (xor & -xor).
                           3. Partition into two groups & XOR separately.

Are duplicates triplets (3x or kx)?
 └── Count bits position-by-position (0 to 31) and take (sum % k).
```
