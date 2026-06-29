
---

# Lock-based classes

These classes use a **lock (mutex)** so only one thread (or a limited number of threads) can access a critical section at a time.

Examples:

- ReentrantLock
    
- ReentrantReadWriteLock
    
- StampedLock
    
- synchronized keyword

## Internal working

Suppose two threads want to update a shared variable.

```
balance = 1000
```

Thread A:

```
lock.lock()

balance = balance + 100

lock.unlock()
```

Thread B:

```
lock.lock()

balance = balance - 50

lock.unlock()
```

Timeline

```
Thread A
---------
Acquire Lock
Update
Release Lock

               Thread B
               ----------
               Wait
               Wait
               Acquire
               Update
               Release
```

Only one thread enters the critical section.

The other thread **blocks**.

---

# Lock-free classes

These do **not** use locks.

Instead, they use a CPU instruction called

```
CAS
Compare And Swap
```

Examples

- AtomicInteger
    
- AtomicLong
    
- AtomicReference
    
- ConcurrentLinkedQueue

Instead of waiting…

Thread keeps retrying until it succeeds.

---

# How CAS works

Suppose

```
count = 5
```

Thread A wants

```
5 → 6
```

CPU performs

```
CAS(expected=5, new=6)
```

If value is still 5

```
Success
```

If another thread already changed it

```
Current value = 7

Expected = 5

Fail
```

Then

```
Read again

Retry
```

No blocking.

---

# Visualization

## Lock

```
        LOCK

Thread A --------> Working

Thread B ---- Waiting

Thread C ---- Waiting
```

---

## Lock-Free

```
Thread A

CAS
Success

Thread B

CAS
Fail

Retry

CAS
Success

Thread C

CAS
Retry

CAS
Retry

CAS
Success
```

Nobody sleeps.

Nobody blocks.

---

# Main Difference

|Lock-based|Lock-Free|
|---|---|
|Uses lock|No lock|
|Threads may block|Threads never block waiting for a lock|
|Context switching|Very little blocking/context switching|
|Simple to reason about|Harder internally|
|Good for complex operations|Good for small atomic operations|
|Lower CPU usage under contention|May use more CPU due to retries under heavy contention|

---

# Performance

Imagine 100 threads.

## Lock

```
Thread 1 -> Running

99 threads

Waiting…
Waiting…
Waiting…
```

CPU switches between blocked threads.

More waiting.

---

## Lock-Free

```
Thread 1
CAS

Thread 2
Retry

Thread 3
Retry

Thread 4
Retry
```

No blocking.

But retries consume CPU.

So lock-free is **not always faster**. Under very high contention, excessive retries can reduce performance.

---

# Industrial Example 1

## Bank Transfer

```
Account A
Account B
```

Transfer requires

```
Debit

Credit

Transaction

Validation

Rollback
```

Multiple objects must stay consistent.

Use

```
ReentrantLock
```

or

```
synchronized
```

Reason

Entire transaction must remain consistent.

CAS cannot easily update multiple related variables atomically.

---

# Industrial Example 2

Visitor Counter

```
Website

Current Visitors

Page Views

Downloads
```

Need only

```
count++
```

Use

```
AtomicInteger
```

Much faster than locking.

---

# Industrial Example 3

Spring Boot Request Counter

```
API Request

↓

incrementCounter()

↓

AtomicLong.incrementAndGet()
```

Millions of requests.

No need for lock.

---

# Industrial Example 4

Producer Consumer Queue

Thousands of producers

Thousands of consumers

Use

```
ConcurrentLinkedQueue
```

Internally

```
CAS

CAS

CAS

CAS
```

Almost no locking.

Very scalable.

---

# Industrial Example 5

Cache

Suppose

```
ConcurrentHashMap<UserId, User>
```

Many threads

```
Read

Read

Read

Update
```

Internally

`ConcurrentHashMap` uses a combination of fine-grained locking and lock-free techniques (such as CAS) rather than one global lock. This allows many operations to proceed concurrently while keeping updates thread-safe.

---

# When should you use Lock classes?

Use locks when you need:

- Multiple operations to happen as one atomic unit
    
- Consistency across several shared variables or objects
    
- Complex business logic that cannot be expressed as a single atomic update
    
- Features like fairness, timed lock attempts, or interruptible locking (available with `ReentrantLock`)

Example

```java
lock.lock();

try {
    withdraw();
    updateHistory();
    sendNotification();
} finally {
    lock.unlock();
}
```

All operations happen while holding the lock.

---

# When should you use Lock-Free classes?

Use lock-free classes when:

- Updating a single shared value
    
- Implementing counters or sequence numbers
    
- Tracking statistics or metrics
    
- Building high-throughput concurrent data structures
    
- You want maximum scalability with simple atomic operations

Example

```java
requestCount.incrementAndGet();
```

---

# Industry Rule of Thumb

|Situation|Preferred Choice|
|---|---|
|Counter|`AtomicInteger` / `AtomicLong`|
|Statistics|Atomic classes|
|Metrics|Atomic classes|
|ID generator|Atomic classes|
|Bank transaction|`ReentrantLock` or `synchronized`|
|Inventory update involving multiple fields|Lock-based|
|Complex business logic|Lock-based|
|High-performance concurrent queue|`ConcurrentLinkedQueue`|
|Many readers, few writers|`ReentrantReadWriteLock` or `StampedLock`|

---

