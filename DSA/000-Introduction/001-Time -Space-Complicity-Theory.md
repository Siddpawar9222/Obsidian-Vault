---

# Algorithm Analysis: Time Complexity, Space Complexity & Asymptotic Notation

---

# Why Do We Need Time Complexity and Space Complexity?

When we write an algorithm, our first question is usually:

> **"Is my algorithm good?"**

A beginner might think we can simply run the program and measure:

- Execution time (seconds)
- Memory usage (MB)

However, this approach has a major problem.

Different computers produce different results.

For example, consider the same sorting algorithm.

|Computer|Execution Time|
|---|--:|
|High-end Gaming PC|0.5 sec|
|Old Laptop|3 sec|

Did the algorithm change?

**No.**

Only the hardware changed.

Similarly, actual memory usage can also differ because of:

- 32-bit vs 64-bit architecture
- JVM implementation
- Object alignment
- Pointer/reference size
- Operating System

So measuring actual execution time or memory usage **does not give a fair comparison between algorithms.**

Instead, computer scientists wanted a way to compare algorithms **independent of hardware**.

This led to:

- **Time Complexity**
- **Space Complexity**

These measure **how the work grows** as the input size grows, not the exact execution time or memory used.

---

# Hardware Dependency

|What we Measure|Hardware Dependent?|
|---|---|
|Execution Time (seconds)|✅ Yes|
|Actual Memory Usage (bytes/MB)|✅ Yes|
|Time Complexity|❌ No|
|Space Complexity|❌ No|

Remember this table. It is one of the most important concepts in algorithm analysis.

---

# What is Time Complexity?

## Definition

> **Time Complexity measures how the number of operations performed by an algorithm grows as the input size (`n`) increases.**

Notice something important.

It **does not measure seconds.**

Instead, it measures **the growth of computational work.**

---

## Example

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
```

If

```
n = 10
```

Loop executes about **10 times**

If

```
n = 100
```

Loop executes about **100 times**

If

```
n = 1,000
```

Loop executes about **1,000 times**

Number of operations grows linearly with `n`.

Therefore,

```
Time Complexity = O(n)
```

---

## Important Point

Suppose

Computer A executes

```
1 billion operations/second
```

Computer B executes

```
100 million operations/second
```

Execution time will be different.

But both algorithms still perform approximately **n operations.**

Therefore,

```
Time Complexity remains O(n)
```

---

# What is Space Complexity?

## Definition

> **Space Complexity measures how the amount of memory required by an algorithm grows as the input size (`n`) increases.**

Again,

It does **not measure exact bytes.**

It measures **how memory requirement grows.**

---

## Example

```java
int[] arr = new int[n];
```

If

```
n = 10
```

Memory for 10 integers

If

```
n = 100
```

Memory for 100 integers

If

```
n = 1,000
```

Memory for 1,000 integers

Memory grows linearly.

Therefore,

```
Space Complexity = O(n)
```

---

## Does 32-bit or 64-bit Matter?

Yes, for **actual memory usage**.

For example, references may be:

- 32-bit JVM → around 4 bytes
- 64-bit JVM → around 8 bytes (or 4 bytes with compressed references)

So actual memory used may differ.

Example

Machine A

```
4n bytes
```

Machine B

```
8n bytes
```

But in both cases,

```
Space Complexity = O(n)
```

because Big-O ignores constant factors.

---

# Summary

|Measure|Depends On Hardware?|What It Measures|
|---|---|---|
|Execution Time|✅ Yes|Actual running time|
|Actual Memory Usage|✅ Yes|Exact bytes used|
|Time Complexity|❌ No|Growth of operations|
|Space Complexity|❌ No|Growth of memory|

---

# What is Asymptotic Notation?

Now that we know we measure the **growth** of an algorithm instead of actual seconds or bytes, we need a mathematical way to describe that growth.

That mathematical language is called **Asymptotic Notation**.

---

## Definition

> **Asymptotic Notation is a mathematical notation used to describe how the time or space complexity of an algorithm grows as the input size (`n`) becomes very large.**

It focuses on the **growth rate**, not the exact number of operations.

---

## Why Do We Need Asymptotic Notation?

Suppose an algorithm performs:

```
3n² + 5n + 10
```

For

```
n = 10
```

Operations

```
300 + 50 + 10 = 360
```

For

```
n = 1,000,000
```

Operations

```
3 × (1,000,000²)
+ 5 × 1,000,000
+ 10
```

The `3n²` term dominates, while `5n` and `10` become insignificant in comparison.

So instead of writing

```
3n² + 5n + 10
```

we simply write

```
O(n²)
```

This makes it much easier to compare algorithms.

---

# Common Asymptotic Notations

| Notation          | Meaning                    |
| ----------------- | -------------------------- |
| **O (Big-O)**     | Upper bound (Worst Case)   |
| **Ω (Big-Omega)** | Lower bound (Best Case)    |
| **Θ (Big-Theta)** | Tight Bound (Exact Growth) |

![[time-complicity.png]]
---
