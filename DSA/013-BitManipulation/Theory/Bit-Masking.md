# Bit Masking in DSA — Beginner to Interview Level

---

## 1. What is Bit Masking?

**Bit masking** is a foundational technique in bit manipulation used to **check, set, clear, and toggle** individual bits of a number using bitwise operators.

In Simpler language,

> **A bit mask is just a regular number (in binary) that you craft specifically to target, filter, or modify certain bits of another number.**


---

### Visualizing Bit Positions: The Number `10`

In binary, the decimal number `10` is stored in an 8-bit byte as:

$$\text{Decimal } 10 = 00001010_2$$

Bit positions are always **0-indexed** from right to left (from bit $0$ up to bit $7$):

| Bit Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Power of 2** | $2^7$ ($128$) | $2^6$ ($64$) | $2^5$ ($32$) | $2^4$ ($16$) | $2^3$ ($8$) | $2^2$ ($4$) | $2^1$ ($2$) | $2^0$ ($1$) |
| **Bit Value** | **0** | **0** | **0** | **0** | **1** | **0** | **1** | **0** |

Notice:
- Bit at position **$1$** is **$1$** ($2^1 = 2$).
- Bit at position **$3$** is **$1$** ($2^3 = 8$).
- Sum: $8 + 2 = 10$.

---

## 2. How a Bit Mask Works Internally: Left Shift (`1 << i`)

To create a mask that targets bit position `i`, we use the **left-shift operator (`<<`)**:

$$\text{mask} = 1 \ll i$$

This expression takes the number `1` (which has only bit 0 set) and shifts that `1` to the left by `i` positions.

### Step-by-Step Mask Creation Example (`i = 1`):

```text
1 in 8-bit binary:    0000 0001
1 << 1 (shift left 1): 0000 0010  (Decimal 2)
```

Now, perform bitwise AND (`&`) between `n = 10` and `mask = 2`:

```java
int n = 10;
int mask = 1 << 1;

System.out.println(n & mask); // Output: 2
```

### Why is the output `2`?

```text
n         =  0000 1010   (10)
mask      =  0000 0010   (2)
----------------------
n & mask  =  0000 0010   (2)
```

- The `&` (AND) operator returns `1` **only if both bits are `1`**.
- Because bit 1 was `1` in both `n` and `mask`, the result has bit 1 set, yielding decimal `2`.
- **Key Takeaway:**
  - If `n & (1 << i) != 0` $\rightarrow$ The $i$-th bit is **SET (`1`)**.
  - If `n & (1 << i) == 0` $\rightarrow$ The $i$-th bit is **UNSET (`0`)**.

---

## 3. The Four Fundamental Bit Masking Operations

These four operations form the core toolkit for solving bit manipulation problems:

| Operation | Action | Bitwise Operator | Formula | Compound Form |
| :--- | :--- | :---: | :--- | :--- |
| **1. Check** | Read whether bit $i$ is `1` or `0` | `&` (AND) | `(n & (1 << i)) != 0` | — |
| **2. Set** | Force bit $i$ to become `1` | `\|` (OR) | `n = n \| (1 << i)` | `n \|= (1 << i)` |
| **3. Clear** | Force bit $i$ to become `0` | `& ~` (AND NOT) | `n = n & ~(1 << i)` | `n &= ~(1 << i)` |
| **4. Toggle** | Flip bit $i$ (`0` $\leftrightarrow$ `1`) | `^` (XOR) | `n = n ^ (1 << i)` | `n ^= (1 << i)` |

*(Here, `i` is the 0-indexed bit position counted from the rightmost bit).*

---

### Operation 1: Check Whether Bit $i$ is Set

To read the bit at position $i$, mask with `1 << i`:

```java
boolean isSet = (n & (1 << i)) != 0;
// Alternative approach:
boolean isSetAlt = ((n >> i) & 1) == 1;
```

#### Example: Check if bit 2 is set in `10`:
```text
10 (binary):   1010
1 << 2 (mask): 0100
-------------------
AND Result:    0000  (= 0)
```
Result: **`false`** (bit 2 is not set).

---

### Operation 2: Set Bit $i$ to `1`

To turn bit $i$ ON without changing any other bit, use bitwise OR (`|`):

```java
n = n | (1 << i);
// Short form:
n |= (1 << i);
```

#### Example: Set bit 2 in `10`:
```text
10 (binary):   1010  (10)
1 << 2 (mask): 0100  (4)
-------------------
OR Result:     1110  (14)
```
Result: **`14`**. Bit 2 changed from `0` to `1`; all other bits stayed exactly the same.

---

### Operation 3: Clear Bit $i$ to `0`

To turn bit $i$ OFF without disturbing any other bit, use bitwise AND (`&`) with the **inverted mask (`~`)**:

```java
n = n & ~(1 << i);
// Short form:
n &= ~(1 << i);
```

#### Why `~` (Bitwise NOT) Works:
- The mask `(1 << i)` has `1` only at position $i$ and `0` everywhere else.
- Inverting it `~(1 << i)` produces `0` only at position $i$ and `1` everywhere else.
- When you AND with this inverted mask:
  - Any bit ANDed with `1` stays unchanged ($x \ \& \ 1 = x$).
  - The target bit ANDed with `0` is forced to `0` ($x \ \& \ 0 = 0$).

#### Example: Clear bit 1 in `10`:
```text
n           = 1010
mask (1<<1) = 0010
~mask       = 1101
------------------
n & ~mask   = 1000  (8)
```
Result: **`8`**. Bit 1 changed from `1` to `0`; all other bits stayed unchanged.

---

### Operation 4: Toggle Bit $i$ (`0` $\rightarrow$ `1`, `1` $\rightarrow$ `0`)

To flip bit $i$, use bitwise XOR (`^`):

```java
n = n ^ (1 << i);
// Short form:
n ^= (1 << i);
```

#### Why XOR (`^`) Works:
- $0 \oplus 1 = 1$ (turns 0 into 1)
- $1 \oplus 1 = 0$ (turns 1 into 0)
- $x \oplus 0 = x$ (leaves all other bits unchanged)

#### Example: Toggle bit 1 in `10`:
```text
10 (binary):   1010  (10)
1 << 1 (mask): 0010  (2)
-------------------
XOR Result:    1000  (8)
```
Result: **`8`**. Bit 1 was flipped from `1` to `0`. If we toggle it again, it flips back to `10`.

---

## 4. Real-World & DSA Applications

Bit masking is widely used in competitive programming and real-world software:

1. **Even vs. Odd Check:**
   - Instead of `n % 2 != 0`, use `(n & 1) == 1`.
   - Checks whether the 0th bit (value 1) is set.
2. **State Compression:**
   - Represent multiple boolean flags (e.g., visited nodes in a graph of up to 32 vertices) using a single 32-bit `int` instead of a `boolean[]` array, saving massive memory and cache misses.
3. **Generating Subsets (Power Set):**
   - For an array of size $n$, numbers from $0$ to $(2^n - 1)$ act as bitmasks representing all $2^n$ subsets.
   - If the $j$-th bit of mask $i$ is set, include element $j$ in the subset.
4. **Bitmask Dynamic Programming (DP):**
   - Problems like the Traveling Salesperson Problem (TSP), assignment problems, and matching problems represent visited sets of vertices as bitmasks in the DP state `dp[mask][u]`.
5. **Checking and Isolating Powers of 2:**
   - Check if $n$ is a power of 2: `(n > 0) && ((n & (n - 1)) == 0)`.
   - Isolate rightmost set bit: `n & (-n)`.
6. **Hardware & Embedded Systems:**
   - Reading sensor states, configuring device registers, and network packet header inspection.

---

## 5. Quick Revision Cheat Sheet

```text
Targeting the i-th bit (0-indexed from right):

  Read Bit   : (n & (1 << i)) != 0
  Set Bit    :  n | (1 << i)
  Clear Bit  :  n & ~(1 << i)
  Toggle Bit :  n ^ (1 << i)
```


---

