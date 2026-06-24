
---

## Why CAS Was Introduced?

Suppose multiple threads are updating the same variable:

```java
int count = 0;

count++;
```

Internally, `count++` is actually:

```java
read count
add 1
write count
```

These are 3 separate operations.

If two threads execute them simultaneously:

```text
Thread-1 reads 0
Thread-2 reads 0

Thread-1 writes 1
Thread-2 writes 1
```

Final value:

```text
1
```

Expected:

```text
2
```

This is called a **Race Condition**.

---

# Traditional Solution

Use lock:

```java
synchronized(lock){
    count++;
}
```

Problem:

- Thread blocking
    
- Context switching
    
- Performance overhead
    

To avoid this, CPUs provide a special atomic instruction called **CAS (Compare And Set)**.

---

# What CAS Does?

CAS performs:

```text
IF currentValue == expectedValue
    update value
    return true
ELSE
    return false
```

as one indivisible operation.

Example:

```java
AtomicInteger count = new AtomicInteger(5);

count.compareAndSet(5, 6);
```

CPU checks:

```text
Current value = 5
Expected value = 5

Match ?
Yes

Update to 6
Return true
```

---

# Why CAS Is Safe?

Suppose:

```java
count = 5
```

Two threads execute:

```java
CAS(5, 6)
CAS(5, 7)
```

simultaneously.

Possible result:

```text
Thread-1 succeeds
count becomes 6

Thread-2 fails
because current value is no longer 5
```

Final value:

```text
6
```

No data corruption.

---

# How Does CPU Guarantee This?

Java does not perform CAS itself.

Flow:

```text
AtomicInteger
      ↓
JVM
      ↓
CPU Atomic Instruction
```

<font color="#ffc000">On x86 processors</font>, CAS is typically implemented using special atomic instruction:
```assembly
CMPXCHG
```

or

```assembly
LOCK CMPXCHG
```

The CPU guarantees:

```text
Compare + Update
```

happens atomically.

No other CPU core can interfere during that operation.

---

# What Happens In Multi-Core CPUs?

Example:

```text
Core-1 running Thread-1
Core-2 running Thread-2
```

Both have:

```java
count = 5
```

stored in their CPU cache.

```text
Core-1 Cache = 5
Core-2 Cache = 5
```

---

# Cache Coherency Protocol (MESI)

Modern CPUs keep caches synchronized using protocols like:

```text
MESI

M = Modified
E = Exclusive
S = Shared
I = Invalid
```

Initially:

```text
Core-1 Cache = 5 (Shared)
Core-2 Cache = 5 (Shared)
```

---

# Thread-1 Executes CAS

Before modification:

```text
Core-1 requests Exclusive Ownership
of the cache line.
```

Hardware sends:

```text
Invalidate other copies.
```

Core-2 receives:

```text
Your cache line is invalid.
```

Now:

```text
Core-1 = Exclusive Owner
```

Core-1 performs:

```text
Compare 5
Swap to 6
```

Successfully.

---

# What Happens To Thread-2?

Thread-2 tries:

```text
CAS(5, 7)
```

But its cache was invalidated.

So it fetches latest value:

```text
6
```

Now:

```text
Expected = 5
Current = 6
```

CAS fails:

```java
false
```

---

# What If Both Threads Reach CAS At Exactly Same Time?

This is where hardware arbitration happens.

Both cores may request ownership:

```text
Core-1: I want ownership.
Core-2: I want ownership.
```

CPU hardware chooses one winner.

Example:

```text
Core-1 wins.
```

Core-2 waits a few CPU cycles.

Only one CAS operation can succeed.

There is always:

```text
One Winner
One Loser
```

Never:

```text
Two Winners
```

When multiple cores try to atomically update the same memory location, hardware eventually serializes the competing requests and selects a single winner (often the first request to obtain ownership,time difference very very very small). Only that winner performs the update; all others must retry.

---

# Is Memory Controller Responsible?

Partially, but not entirely.

Modern CPUs mostly use:

```text
Cache Coherency Protocol
+
Cache Line Ownership
+
Atomic CPU Instructions
```

to manage CAS.

Most CAS operations happen inside CPU caches.

RAM and Memory Controller are often not involved.

---

# Does CAS Use Locks?

### From Java Perspective

```text
No
```

No:

- synchronized
    
- ReentrantLock
    
- Thread blocking
    

Therefore CAS is called:

```text
Lock-Free
```

---

### From CPU Perspective

<font color="#ffc000">Hardware still uses synchronization mechanisms.</font>

Example:

```assembly
LOCK CMPXCHG
```

or cache-line ownership.

So CAS is not "magic".

The CPU internally coordinates cores to ensure atomicity.

---

# How AtomicInteger.incrementAndGet() Works

Simplified implementation:

```java
while(true){

    int oldValue = get();

    int newValue = oldValue + 1;

    if(compareAndSet(oldValue, newValue)){
        return newValue;
    }
}
```

---

Example:

```text
counter = 0
```

10 threads read:

```text
0
```

All attempt:

```text
CAS(0,1)
```

Only one succeeds.

Counter becomes:

```text
1
```

Remaining 9 threads fail.

They retry:

```text
Read 1
CAS(1,2)
```

Again only one succeeds.

This continues until all updates are applied correctly.

---


