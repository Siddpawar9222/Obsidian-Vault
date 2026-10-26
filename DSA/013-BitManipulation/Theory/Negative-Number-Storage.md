# Negative Number Storage: Why Computers Use Two's Complement

---

## 1. The Core Purpose: Why Two's Complement?

A fundamental question in computer architecture is: **Why does Java (and almost every modern computer system) use Two's Complement to represent negative numbers?**

The short answer:

> [!IMPORTANT]
> **Two's complement allows the CPU to use the exact same binary addition circuitry for both positive and negative numbers.**
> The CPU does not need separate hardware circuits for subtraction or negative numbers—every subtraction is simply converted into an addition!

Let's understand how this works step-by-step.

---

## 2. The Problem: Why Earlier Approaches Failed

Suppose we are working with a **4-bit system**.

For positive numbers, binary is straightforward:
```text
0000 = 0
0001 = 1
0010 = 2
0011 = 3
0100 = 4
0101 = 5
0110 = 6
0111 = 7
```

How should we represent negative numbers like $-1, -2, -3$? Computer pioneers tried two earlier methods before settling on two's complement.

---

### Attempt 1: Sign-Magnitude Representation

The simplest idea is to reserve the **first bit (MSB)** as a sign bit:
- `0` = positive
- `1` = negative

Under this system:
- `+1` = `0001`
- `-1` = `1001`

#### Fatal Flaw: Normal Addition Fails
Imagine the CPU calculates $1 + (-1)$:

```text
    0001   (+1)
  + 1001   (-1)
  ------
    1010   (= -2 in sign-magnitude! Not 0)
```

The result is `1010` ($-2$), which is completely wrong. To make sign-magnitude work, the CPU would need complex extra circuitry to inspect signs, compare magnitudes, and perform manual subtraction.

---

### Attempt 2: One's Complement

The next idea was to represent a negative number by simply **inverting all bits**:
- `+1` = `0001`
- Invert all bits: `1110` (represents $-1$)

#### Fatal Flaw: Two Representations of Zero
In One's Complement, zero has two different binary representations:
- `0000` = `+0`
- `1111` = `-0`

Having two zeroes causes serious problems:
- It wastes a valid binary code.
- Every comparison check (`if (x == 0)`) requires testing against both `0000` and `1111`, slowing down the processor.

---

## 3. How Two's Complement Solves Both Problems

Two's complement overcomes both flaws:
1. **Normal binary addition produces mathematically correct results.**
2. **There is only one unique representation for zero (`0000`).**

### How to Find the Two's Complement of a Number

To find the negative representation of any positive number:
1. **Start with the positive binary representation.**
2. **Invert all bits** (flip `0` to `1` and `1` to `0`).
3. **Add 1** to the inverted result.

#### Example: Finding `-1` in a 4-bit System

```text
Step 1: Write +1 in binary:
  0001

Step 2: Invert all bits (One's complement):
  1110

Step 3: Add 1:
    1110
  +    1
  ------
    1111

Result:
  -1 is represented as 1111
```

---

### Verifying with Binary Addition: $1 + (-1) = 0$

Now watch what happens when the CPU performs binary addition on $1 + (-1)$:

```text
    0001   (+1)
  + 1111   (-1)
  ------
  1 0000
```

Because our register only holds **4 bits**, the 5th carry bit overflows and is simply discarded:

```text
    0000   (= 0)
```

🎯 **The addition produces exactly `0` without any special hardware!**

The CPU uses the exact same adder circuit for all cases:
- $\text{positive} + \text{positive}$
- $\text{positive} + \text{negative}$
- $\text{negative} + \text{positive}$
- $\text{negative} + \text{negative}$

---

### Verifying Zero: Only One Zero Exists

What happens if we take the two's complement of `0000`?

```text
Step 1: Start with 0:
  0000

Step 2: Invert all bits:
  1111

Step 3: Add 1:
    1111
  +    1
  ------
  1 0000  → Discard carry bit → 0000
```

The result is still `0000`. **There is only one zero.**

---

## 4. Mathematical Definition of Two's Complement

Why is it called **"Two's Complement"**?

Mathematically, for an $n$-bit number, the two's complement representation of a negative number $-x$ is given by:

$$\text{Binary}(-x) = 2^n - |x|$$

For a **4-bit number** ($n = 4$, so $2^4 = 16$):

| Number | Formula ($16 - |x|$) | Calculation | 4-bit Binary Result |
| :---: | :---: | :---: | :---: |
| **$-1$** | $16 - 1$ | $15$ | `1111` |
| **$-2$** | $16 - 2$ | $14$ | `1110` |
| **$-5$** | $16 - 5$ | $11$ | `1011` |

This mathematical definition matches the shortcut: **Invert bits + 1**.

---

## 5. Complete 4-Bit Two's Complement Range

Here is the complete mapping of all 16 values possible with 4 bits:

| Binary | Decimal Value | Meaning |
| :---: | :---: | :--- |
| `0000` | **$0$** | Zero |
| `0001` | **$+1$** | Positive |
| `0010` | **$+2$** | Positive |
| `0011` | **$+3$** | Positive |
| `0100` | **$+4$** | Positive |
| `0101` | **$+5$** | Positive |
| `0110` | **$+6$** | Positive |
| `0111` | **$+7$** | **Maximum Positive Value** |
| `1000` | **$-8$** | **Minimum Negative Value** |
| `1001` | **$-7$** | Negative |
| `1010` | **$-6$** | Negative |
| `1011` | **$-5$** | Negative |
| `1100` | **$-4$** | Negative |
| `1101` | **$-3$** | Negative |
| `1110` | **$-2$** | Negative |
| `1111` | **$-1$** | Negative |

---

### The Asymmetry Property: Why is there $-8$ but no $+8$?

Notice the range for 4 bits:
$$\text{Range: } -8 \text{ to } +7$$

There are 16 total patterns ($2^4 = 16$):
- Patterns starting with `0` (Non-negative): `0000` to `0111` ($8$ values: $0$ through $+7$).
- Patterns starting with `1` (Negative): `1000` to `1111` ($8$ values: $-8$ through $-1$).

> [!NOTE]
> Because `0` takes one of the "starts with 0" patterns, the positive range reaches only $+7$ ($2^{n-1} - 1$). The negative range has no zero to account for, so it reaches all the way to $-8$ ($-2^{n-1}$).
> 
> That is why two's complement always has **one more negative number than positive numbers**.

---

### Scaling to Java's 32-Bit `int`

The exact same formula applies to Java's 32-bit `int` ($n = 32$):

$$\text{Range: } -2^{31} \text{ to } 2^{31} - 1$$

- **Minimum value:** $-2{,}147{,}483{,}648$
- **Maximum value:** $+2{,}147{,}483{,}647$

---

## 6. Connection to MSB, `Integer.MAX_VALUE`, and `Integer.MIN_VALUE`

In Two's Complement, the **Most Significant Bit (MSB)** acts as the sign indicator:
- **`0`** $\rightarrow$ Non-negative (positive or zero)
- **`1`** $\rightarrow$ Negative

### `Integer.MAX_VALUE` ($+2{,}147{,}483{,}647$)
To get the largest positive number, we want the sign bit to be `0` and all other bits to be `1`:

```text
MSB (Sign: 0)
 ↓
 01111111 11111111 11111111 11111111
```

### `Integer.MIN_VALUE` ($-2{,}147{,}483{,}648$)
To get the most negative number, we set the sign bit to `1` and all remaining bits to `0`:

```text
MSB (Sign: 1)
 ↓
 10000000 00000000 00000000 00000000
```

> [!WARNING]
> **Edge Case with `Integer.MIN_VALUE`:**
> What is `-Integer.MIN_VALUE`?
> Because there is no positive $+2{,}147{,}483{,}648$ in 32 bits, negating `Integer.MIN_VALUE` overflows right back to `Integer.MIN_VALUE`!
> In Java: `-(-2147483648) == -2147483648`.

---

## 7. Quick Revision Cheat Sheet

```text
Two's Complement Concept Chain:
Two's Complement
      ↓
Negative numbers encoded such that (A + (-A) = 0)
      ↓
Standard binary addition hardware handles all math
      ↓
CPU hardware remains simple, fast, and unified
```

- **Algorithm**: Two's Complement = $\text{Invert all bits} + 1$.
- **Formula**: $\text{Binary}(-x) = 2^n - |x|$.
- **Sign Bit (MSB)**: `0` = positive/zero, `1` = negative.
- **Single Zero**: Only `0000...` represents zero (no `+0` / `-0`).
- **Asymmetric Range**: $-2^{n-1}$ to $2^{n-1} - 1$.
- **`Integer.MAX_VALUE`**: `01111111...` ($+2{,}147{,}483{,}647$).
- **`Integer.MIN_VALUE`**: `10000000...` ($-2{,}147{,}483{,}648$).
