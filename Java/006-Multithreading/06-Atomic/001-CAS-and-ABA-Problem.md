
---

# First Understand What CAS Checks

Suppose:

```java
AtomicReference<String> value =
    new AtomicReference<>("A");
```

Thread-1 wants to update:

```java
value.compareAndSet("A", "C");
```

CAS only checks:

```text
Current Value == Expected Value ?
```

It does NOT check:

```text
Has this value changed before?
How many times changed?
Who changed it?
```

It only compares the current value.

This creates the ABA Problem.

---

# Normal CAS Timeline

Initial:

```text
Value = A
```

### Thread-1

Reads:

```text
A
```

Then gets paused.

---

### Thread-2

Changes:

```text
A → B
```

Then:

```text
B → C
```

Current value:

```text
C
```

---

### Thread-1 resumes

Attempts:

```java
CAS(A, D)
```

Current value:

```text
C
```

Expected:

```text
A
```

CAS fails.

This is correct behavior.

---

# ABA Problem Timeline

Now let's use the exact scenario from your image.

Initial:

```text
Value = A
```

---

## Step 1

Thread-1 reads:

```text
A
```

and gets paused.

```text
T1 = A
```

---

## Step 2

Thread-2 starts working.

Current:

```text
A
```

Thread-2 changes:

```text
A → B
```

---

## Step 3

Thread-2 again changes:

```text
B → A
```

Now current value is:

```text
A
```

again.

---

Timeline:

```text
Initial

A

↓

Thread-2

A → B

↓

B → A

↓

Current Value = A
```

---

## Step 4

Thread-1 wakes up.

Remember:

```text
Thread-1 still thinks:

"I saw A before."
```

Now it executes:

```java
CAS(A, C)
```

CAS checks:

```text
Current Value = A
Expected Value = A
```

Match ?

```text
YES
```

CAS succeeds.

---

# Why Is This Wrong?

Thread-1 thinks:

```text
Nobody touched the value.
```

But reality:

```text
A → B → A
```

Value changed twice.

CAS couldn't detect it.

Because CAS only checks:

```text
Current Value
```

not

```text
History of Changes
```

---

# Visual Representation

Exactly like your image:

```text
Initial

A
│
│  T1 Reads A
│
├─────────────── T1 Paused
│
│
├── T2 : A → B
│
├── T2 : B → A
│
│
└─────────────── T1 Resumes

CAS(A,C)

Current = A
Expected = A

SUCCESS
```

But the value actually changed.

This is ABA Problem.

---

# Real World Example

Imagine a bank account reference.

Thread-1 sees:

```text
Account = A
```

and pauses.

Meanwhile:

```text
A → B
```

Money transferred.

Then:

```text
B → A
```

Money transferred back.

Thread-1 resumes.

It sees:

```text
Still A
```

and assumes:

```text
Nothing happened.
```

This assumption is wrong.

---

# Why Is ABA Dangerous?

In simple counters:

```java
AtomicInteger
```

ABA is usually harmless.

But in lock-free data structures:

- Stack
    
- Queue
    
- Linked List
    
- Memory management
    
- Object references
    

ABA can corrupt the structure.

That's why JVM provides a solution.

---

# Solution: Version Number

Instead of storing:

```text
A
```

store:

```text
(A,1)
```

where:

```text
Value + Version
```

are stored together.

---

Initial:

```text
(A,1)
```

Thread-1 reads:

```text
(A,1)
```

and pauses.

---

Thread-2:

```text
(A,1)

↓

(B,2)

↓

(A,3)
```

Notice:

```text
Value became A again
```

but version changed:

```text
1 → 3
```

---

Thread-1 resumes.

Attempts:

```text
CAS((A,1), (C,2))
```

Current value:

```text
(A,3)
```

Expected:

```text
(A,1)
```

Not equal.

CAS fails.

Now ABA is detected.

---

# Visual Representation of Versioning

```text
Initial

(A,1)
│
│  T1 Reads (A,1)
│
├─────────────── T1 Paused
│
│
├── T2 : (A,1) → (B,2)
│
├── T2 : (B,2) → (A,3)
│
│
└─────────────── T1 Resumes

CAS((A,1), (C,2))

Current = (A,3)
Expected = (A,1)

Stamp mismatch! (3 != 1)
FAILURE
```

---

# Java Solution

Java provides:

```java
AtomicStampedReference<T>
```

Stamp = Version Number

Example:

```java
AtomicStampedReference<String> ref =
    new AtomicStampedReference<>("A", 1);
```

CAS checks:

```text
Value
+
Version
```

together.

---
