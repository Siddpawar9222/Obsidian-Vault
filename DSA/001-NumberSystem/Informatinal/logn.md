

# 📌 Logarithm

### Core Definition

$$
\boxed{\log_b(n)=x \iff b^x=n}
$$

**Meaning:**  
`log₍b₎(n)` tells you **"what power of `b` gives `n`?"**

Example:

$$
\log_2(8)=3
$$

because:

$$
2^3=8
$$

---

## Common Logarithm Bases

| Log | Meaning | Example |
|---|---|---|
| `log₂ n` | Power of **2** | `log₂ 8 = 3` |
| `log₁₀ n` | Power of **10** | `log₁₀ 1000 = 3` |
| `ln n` | Power of **e** | `ln(e²) = 2` |

### Important DSA Rule

When you see:

$$
\boxed{O(\log n)}
$$

it normally means **`O(log₂ n)` conceptually**.

The exact base doesn't matter for Big-O:

$$
O(\log_2 n)=O(\log_{10}n)=O(\ln n)
$$

because changing the base only introduces a constant multiplier.

---

# 🔢 Logarithm and Division

`log₂ n` is closely related to **repeatedly dividing by 2**.

Example:

```text
1024
 ↓ /2
512
 ↓ /2
256
 ↓ /2
128
 ↓ /2
64
 ↓ /2
32
 ↓ /2
16
 ↓ /2
8
 ↓ /2
4
 ↓ /2
2
 ↓ /2
1
```

Number of divisions = **10**

Therefore:

$$
\log_2(1024)=10
$$

### DSA intuition

> **`log₂ n` ≈ How many times can I divide `n` by 2 before reaching 1?**

This is why logarithmic complexity appears in:

- Binary Search
- Balanced Binary Trees
- Heap operations
- Divide & Conquer
- Many bit-manipulation problems

---

# 🔢 Logarithm and Number of Digits

For a positive integer `n`:

### Decimal digits

$$
\boxed{\text{digits}=\lfloor\log_{10}(n)\rfloor+1}
$$

Example:

```text
n = 12345

log₁₀(12345) ≈ 4.09

floor(4.09) + 1
= 4 + 1
= 5 digits
```

Why?

```text
10⁰ = 1
10¹ = 10
10² = 100
10³ = 1000
10⁴ = 10000
10⁵ = 100000
```

The powers of 10 tell us the digit ranges.

---

# 💻 Number of Bits

For a positive integer `n`:

$$
\boxed{\text{bits}=\lfloor\log_2(n)\rfloor+1}
$$

Example:

```text
n = 13

13 = 1101₂
```

Therefore:

$$
\lfloor\log_2(13)\rfloor+1
$$

$$
=3+1
$$

$$
=\boxed{4\text{ bits}}
$$

---

# 🧠 The Most Important Mental Model

Remember this:

```text
log₁₀(n)
   ↓
"What power of 10 gives n?"

log₂(n)
   ↓
"What power of 2 gives n?"
```

And:

```text
log₂(n)
   ↓
"How many times can I divide n by 2?"
```

---

# ⚡ Quick Examples

```text
log₂(8)      = 3     → 2³ = 8
log₂(16)     = 4     → 2⁴ = 16
log₂(32)     = 5     → 2⁵ = 32

log₁₀(10)    = 1     → 10¹ = 10
log₁₀(100)   = 2     → 10² = 100
log₁₀(1000)  = 3     → 10³ = 1000
```

### One-line revision

> **Logarithm answers: "What power should I raise the base to, to get this number?"**

And for DSA:

> **`log n` → usually think `log₂ n` → repeated halving → number of bits.**