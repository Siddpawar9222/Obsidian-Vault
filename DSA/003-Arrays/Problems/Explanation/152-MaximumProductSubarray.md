

---

# Maximum Product Subarray — Prefix/Suffix Approach

**LeetCode 152 — Medium**

### Problem

Given an integer array, find the contiguous subarray having the maximum product.

Example:

```text
nums = [2, 3, -2, 4]

Answer = 6

Subarray = [2, 3]
```

---

## Core difficulty

For maximum sum subarray, Kadane's algorithm works because adding a negative number decreases the sum.

For multiplication, the behavior is different because:

```text
positive × positive = positive
negative × negative = positive
positive × negative = negative
```

Therefore, a **negative product can later become a large positive product** when multiplied by another negative.

Example:

```text
[-2, 3, -4]

(-2 × 3) = -6

(-6 × -4) = 24
```

So we need to carefully reason about the number of negative elements.

---

# Key observation: Split the array around zero

Zero is special because:

```text
anything × 0 = 0
```

Therefore, a maximum-product subarray cannot gain anything by crossing a zero.

For example:

```text
[2, 3, 0, 4, 5]
```

can be viewed as two independent segments:

```text
[2, 3]    0    [4, 5]
```

We can solve each non-zero segment independently.

When calculating a running product, encountering `0` means:

```text
current segment is finished
start a new segment
```

That's why we reset the running product to `1`.

Why `1`?

Because `1` is the multiplicative identity:

```text
x × 1 = x
```

---

# Analyze a zero-free segment

For a segment containing no zero, there are three important situations.

### All elements are positive

Example:

```text
[2, 3, 4]
```

The product of the entire segment is positive:

```text
2 × 3 × 4 = 24
```

Taking fewer elements would only make the product smaller.

So:

```text
entire segment = candidate answer
```

---

### Even number of negative elements

Example:

```text
[2, -3, 4, -5, 6]
```

There are 2 negative numbers.

Therefore:

```text
negative × negative = positive
```

The product of the entire segment is positive:

```text
2 × -3 × 4 × -5 × 6 = 720
```

Again, the entire segment is the maximum-product candidate.

So:

```text
Even number of negatives
        ↓
Entire segment has positive product
        ↓
Take the entire segment
```

---

# Odd number of negative elements

This is the interesting case.

Consider:

```text
[1, 2, -1, 2, 4, -1, 10, -2, 10]
```

There are 3 negative numbers.

Therefore, the product of the entire segment is negative.

We don't want the entire segment.

We need to eliminate the effect of **one negative number**.

---

## Why first or last negative?

Suppose we remove the **first negative**:

```text
[1, 2]  [-1]  [2, 4, -1, 10, -2, 10]
```

The useful remaining candidate is:

```text
[2, 4, -1, 10, -2, 10]
```

This is a **suffix** of the original segment.

Now suppose we remove the **last negative**:

```text
[1, 2, -1, 2, 4, -1, 10]  [-2]  [10]
```

The useful candidate is:

```text
[1, 2, -1, 2, 4, -1, 10]
```

This is a **prefix** of the original segment.

Therefore:

```text
Odd number of negatives
        ↓
Need to eliminate one negative
        ↓
Useful candidates come from:
    removing first negative → suffix
    removing last negative  → prefix
        ↓
Find maximum prefix/suffix product
```

---

# Why don't we remove a middle negative?

This is an important part of the reasoning.

Consider:

```text
[1, 2, -1, 2, 4, -1, 10, -2, 10]
```

If we remove the middle `-1`:

```text
[1, 2, -1, 2, 4]    [10, -2, 10]
```

Now:

```text
Left  → 1 negative
Right → 1 negative
```

Both parts have negative products.

So removing a middle negative doesn't give us the desired positive-product candidate.

Therefore, the useful choices are associated with the **first and last negative**.

This is the reason the prefix/suffix approach works.

---

# Why scan from both directions?

Now we know:

```text
Remove first negative
        ↓
suffix candidate

Remove last negative
        ↓
prefix candidate
```

Instead of explicitly finding the first and last negative, we can calculate these candidates naturally.

### Left → Right

Maintain a running product:

```text
prefixProd *= nums[i]
```

This gives us products of prefixes of the current non-zero segment.

So the left-to-right scan can discover the best **prefix candidate**.

### Right → Left

Maintain another running product:

```text
suffixProd *= nums[i]
```

This gives us products of suffixes of the current non-zero segment.

So the right-to-left scan can discover the best **suffix candidate**.

Therefore:

```text
Left → Right  → prefix products
Right → Left  → suffix products
```

Take the maximum product encountered in either scan.

---

# Example

Consider:

```text
[1, 2, -1, 2, 4, -1, 10, -2, 10]
```

### Left → Right

Running products:

```text
1
2
-2
-4
-16
16
160
-320
-3200
```

Maximum:

```text
160
```

This corresponds to:

```text
[1, 2, -1, 2, 4, -1, 10]
```

which excludes the last negative.

---

### Right → Left

Running products:

```text
10
-20
-200
200
800
-800
-1600
-3200
-3200
```

Maximum:

```text
800
```

This corresponds to:

```text
[2, 4, -1, 10, -2, 10]
```

which excludes everything through the first negative.

Therefore:

```text
answer = max(160, 800)
       = 800
```

---

# Zero handling

Consider:

```text
[2, 3, 0, 1, 2]
```

Left scan:

```text
2
6
0
```

At zero:

```java
prefixProd = 1;
```

Then:

```text
1 × 1 = 1
1 × 2 = 2
```

So effectively we have calculated:

```text
[2,3]     [1,2]
```

independently.

Similarly, the right-to-left scan handles the segments from the other direction.

---

# Your implementation

```java
class Solution {
    public int maxProduct(int[] nums) {

        int n = nums.length;

        int prefixProd = 1;
        int suffixProd = 1;

        int ans = nums[0];

        // Left → Right
        for (int i = 0; i < n; i++) {

            prefixProd *= nums[i];

            ans = Math.max(ans, prefixProd);

            // Zero ends the current segment
            if (prefixProd == 0) {
                prefixProd = 1;
            }
        }

        // Right → Left
        for (int i = n - 1; i >= 0; i--) {

            suffixProd *= nums[i];

            ans = Math.max(ans, suffixProd);

            // Zero ends the current segment
            if (suffixProd == 0) {
                suffixProd = 1;
            }
        }

        return ans;
    }
}
```

---

# Understanding each variable

### `prefixProd`

```java
int prefixProd = 1;
```

Represents the running product while scanning:

```text
Left → Right
```

It helps us find the best **prefix candidate**.

---

### `suffixProd`

```java
int suffixProd = 1;
```

Represents the running product while scanning:

```text
Right → Left
```

It helps us find the best **suffix candidate**.

---

### `ans`

```java
int ans = nums[0];
```

Stores the maximum product found so far.

Starting with `nums[0]` is important.

For example:

```text
[-5]
```

The answer is:

```text
-5
```

If we initialized:

```java
ans = 0;
```

we would incorrectly return `0`.

---

# Why this is NOT Kadane's algorithm

Your approach is based on:

```text
Sign of product
      ↓
Number of negative elements
      ↓
Odd/even negative analysis
      ↓
First/last negative
      ↓
Prefix/suffix products
```

It does **not** maintain the maximum subarray ending at the current index in the Kadane sense.

So this is best described as:

> **Prefix/Suffix Product approach for Maximum Product Subarray**

with:

```text
Time  = O(n)
Space = O(1)
```

It is **not Kadane's algorithm or a Kadane variant**.

---

# Alternative solution: Max/Min DP

There is another `O(n)` / `O(1)` solution where we maintain:

```text
maxProductEndingHere
minProductEndingHere
```

That approach is much closer to the **Kadane-style DP idea**, because the state represents the best/worst product of a subarray ending at the current index.

But **that is a different solution from the one you derived**.

For your revision, keep these two approaches separate:

```text
Maximum Product Subarray
│
├── Prefix/Suffix approach
│   ├── Analyze negative parity
│   ├── Zero splits segments
│   ├── Odd negatives → first/last negative
│   └── Scan from both directions
│
└── Max/Min DP approach
    ├── Track maximum product ending here
    ├── Track minimum product ending here
    └── Negative can turn minimum into maximum
```

### One-line intuition to remember

> **For each zero-free segment, if the number of negatives is odd, the maximum product must come from either the prefix before the last negative or the suffix after the first negative; therefore scan from both directions and reset at zero.**

---

