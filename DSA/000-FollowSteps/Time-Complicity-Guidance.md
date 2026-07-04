


-
# What is Time Complexity?

Time Complexity measures **how the running time of an algorithm grows as the input size (`n`) increases**.

It **does not measure actual execution time (seconds)**. Instead, it measures **how the number of operations increases**.

---

# How to Calculate Time Complexity

There are **two common approaches**.

## Method 1: Observation

Use this when the number of iterations is **obvious**.

### Example

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
```

The loop executes exactly **n times**.

```
Total Operations = n
```

Therefore,

```
Time Complexity = O(n)
```

---

## Method 2: Mathematical Summation

Use this when the number of iterations **changes in every iteration** of another loop.

### Example

```java
for (int i = 1; i <= n; i++) {

    for (int j = 1; j <= i; j++) {

        System.out.println(j);

    }

}
```

### Work done in each outer iteration

```
i = 1  → 1 operation

i = 2  → 2 operations

i = 3  → 3 operations

…

i = n  → n operations
```

Total work becomes

```
1 + 2 + 3 + … + n
```

Using the arithmetic series formula,

```
1 + 2 + … + n

=

n(n + 1) / 2
```

Ignoring constants and lower-order terms,

```
Time Complexity = O(n²)
```

---

# Important Difference: Multiplication vs Summation

Many beginners confuse these two ideas.

### Multiplication

Used when **every outer iteration performs the same amount of work.**

```
Outer Loop = n

Inner Loop = n

Total

=

n × n

=

n²
```

---

### Summation

Used when **the work changes for every outer iteration.**

```
1 + 2 + 3 + … + n
```

Although the final answer is also

```
O(n²)
```

the way we reached it is completely different.

---

## Remember this

```
n × n
```

and

```
1 + 2 + 3 + … + n
```

are **not the same calculation**, even though both simplify to

```
O(n²)
```

---

# Golden Formula

Whenever the work changes during execution,

```
Total Work

=

SUM of (work done in each outer loop iteration)
```

This rule is always true.

---

# Rule for Nested Loops

---

## Case 1: Inner Loop is Independent

If the inner loop always runs the same number of times regardless of the outer loop variable, simply multiply.

### Example

```java
for (int i = 0; i < n; i++) {

    for (int j = 0; j < n; j++) {

        System.out.println(i + j);

    }

}
```

Outer loop

```
n
```

Inner loop

```
n
```

Total work

```
n × n
```

Therefore,

```
O(n²)
```

---

## Case 2: Inner Loop Depends on Outer Loop

Never multiply immediately.

Instead, write the summation first.

### Example

```java
for (int i = 1; i <= n; i++) {

    for (int j = 1; j <= i; j++) {

        System.out.println(j);

    }

}
```

Iterations become

```
1

2

3

…

n
```

Total work

```
1 + 2 + 3 + … + n
```

Formula

```
n(n + 1) / 2
```

Therefore,

```
O(n²)
```

---

# Another Important Example (Harmonic Series)

```java
for (int i = 1; i <= n; i++) {

    for (int j = 1; j <= n; j += i) {

        System.out.println(j);

    }

}
```

### Outer iterations

```
i = 1  → n

i = 2  → n/2

i = 3  → n/3

i = 4  → n/4

…

i = n  → 1
```

Total work

```
n + n/2 + n/3 + … + 1
```

Factor out **n**

```
n × (1 + 1/2 + 1/3 + …)
```

The expression inside brackets is the **Harmonic Series**

```
Θ(log n)
```

Therefore,

```
O(n log n)
```

---

# Another Example (Worst Case)

Sometimes an operation inside a loop may itself take up to **O(n)**.

Example:

```java
for (int i = 0; i < n; i++) {

    search(arr, target);   // Worst case O(n)

}
```

If `search()` performs a linear search,

```
Outer loop

=

n
```

```
search()

=

O(n)
```

Total

```
n × n

=

O(n²)
```

> **Always use the worst-case complexity of the operation inside the loop unless the question specifies otherwise.**

---

# Multiplication vs Summation

## Multiply When

- Inner loop is independent of outer loop.
    
- Every outer iteration performs the same work.

Example

```java
for (int i = 0; i < n; i++) {

    for (int j = 0; j < n; j++) {

    }

}
```

```
n × n

=

O(n²)
```

---

## Use Summation When

- Inner loop depends on outer loop.
    
- Work changes every iteration.

Example

```java
for (int i = 1; i <= n; i++) {

    for (int j = 1; j <= i; j++) {

    }

}
```

```
1 + 2 + … + n
```

---

# Worst Case Time Complexity

Unless the question specifically asks for **Best Case** or **Average Case**, always calculate the **Worst Case Time Complexity**.

Example

```java
for (int i = 0; i < n; i++) {

    System.out.println(i);

}
```

Worst Case

```
O(n)
```

---

# Common Mathematical Series

---

## 1. Constant Series

```
1 + 1 + 1 + … + 1
```

(n times)

Result

```
n
```

Time Complexity

```
O(n)
```

Example

```java
for (int i = 0; i < n; i++) {

}
```

---

## 2. Arithmetic Series ⭐

```
1 + 2 + 3 + … + n
```

Formula

```
n(n + 1)/2
```

Time Complexity

```
O(n²)
```

Example

```java
for (int i = 1; i <= n; i++) {

    for (int j = 1; j <= i; j++) {

    }

}
```

---

## 3. Reverse Arithmetic Series

```
n + (n-1) + (n-2) + … + 1
```

Formula

```
n(n + 1)/2
```

Time Complexity

```
O(n²)
```

Example

```java
for (int i = 1; i <= n; i++) {

    for (int j = i; j <= n; j++) {

    }

}
```

---

## 4. Geometric Series (Increasing)

```
1 + 2 + 4 + 8 + … + n
```

Formula

```
≈ 2n
```

Time Complexity

```
O(n)
```

Example

```java
for (int i = 1; i <= n; i *= 2) {

    for (int j = 0; j < i; j++) {

    }

}
```

---

## 5. Geometric Series (Decreasing)

```
n + n/2 + n/4 + n/8 + …
```

Formula

```
≈ 2n
```

Time Complexity

```
O(n)
```

Example

```java
for (int i = n; i >= 1; i /= 2) {

    for (int j = 1; j <= i; j++) {

    }

}
```

---

## 6. Harmonic Series ⭐

```
1 + 1/2 + 1/3 + … + 1/n
```

Result

```
Θ(log n)
```

Therefore,

```
n × (1 + 1/2 + … + 1/n)

=

O(n log n)
```

Example

```java
for (int i = 1; i <= n; i++) {

    for (int j = 1; j <= n; j += i) {

    }

}
```

---

## 7. Logarithmic Progression

```
n

↓

n/2

↓

n/4

↓

…

↓

1
```

Number of divisions

```
log₂n
```

Time Complexity

```
O(log n)
```

Example

```java
for (int i = n; i >= 1; i /= 2) {

}
```

---

## 8. Doubling Progression

```
1

↓

2

↓

4

↓

8

↓

…

↓

n
```

Number of doublings

```
log₂n
```

Time Complexity

```
O(log n)
```

Example

```java
for (int i = 1; i <= n; i *= 2) {

}
```

---

# Summary Table

|Pattern|Formula / Result|Time Complexity|Example|
|---|---|---|---|
|`1 + 1 + … + 1`|`n`|`O(n)`|Single loop|
|`1 + 2 + … + n`|`n(n+1)/2`|`O(n²)`|`j <= i`|
|`n + (n-1) + … + 1`|`n(n+1)/2`|`O(n²)`|`j = i to n`|
|`1 + 2 + 4 + … + n`|`≈ 2n`|`O(n)`|`i *= 2`, inner runs `i` times|
|`n + n/2 + n/4 + …`|`≈ 2n`|`O(n)`|`i /= 2`, inner runs `i` times|
|`1 + 1/2 + … + 1/n`|`Θ(log n)`|`O(log n)`|Harmonic series|
|`n × (1 + 1/2 + … + 1/n)`|`n log n`|`O(n log n)`|`j += i`|
|`n → n/2 → … → 1`|`log₂n` divisions|`O(log n)`|Divide by 2 loop|
|`1 → 2 → … → n`|`log₂n` doublings|`O(log n)`|Multiply by 2 loop|

---

# Checklist for Solving Time Complexity

Whenever you see code, ask yourself:

- Is there recursion?
    
- How many loops are there?
    
- Is the inner loop independent of the outer loop?
    
- If dependent, write a summation instead of multiplying.
    
- Does any loop divide or multiply its variable by a constant? (Usually `O(log n)`)
    
- Does the code match a known mathematical series (Arithmetic, Geometric, Harmonic)?
    
- What is the worst-case complexity of any operation inside the loop?
    
- Ignore constants and lower-order terms.
    
- Write the final answer using **Big-O notation**.

---

# Golden Rules ⭐

### Rule 1

> Never assume **nested loops = O(n²)**.

---

### Rule 2

If every outer iteration performs the same work,

```
Multiply
```

---

### Rule 3

If the work changes every iteration,

```
Write the Summation first.
```

---

### Rule 4

If an operation inside a loop is itself **O(n)** in the worst case, include that cost in the calculation.

Example

```java
for (int i = 0; i < n; i++) {

    linearSearch(arr);

}
```

```
n × O(n)

=

O(n²)
```

---

### Rule 5

Big-O represents the **Worst Case Time Complexity** unless the question explicitly asks for Best Case or Average Case.

---
