# StampedLock

```text
Problem 1 ➔ synchronized
Problem 2 ➔ ReentrantLock
Problem 3 ➔ ReadWriteLock
Problem 4 ➔ StampedLock
```

Every new locak in Java was created to solve specific limitations of its predecessor.

---

## 1. Why Was StampedLock Introduced?

In read-heavy systems, we often see disproportionate traffic ratios:
* **Reads:** 10,000 / sec
* **Writes:** 10 / sec (or even 1 write / minute)

**Common Examples:**
* Configuration Cache
* Product Catalog
* Feature Flags
* User Permissions Cache
* Routing Metadata

### The ReadWriteLock Limitation
With `ReadWriteLock`, multiple threads can read concurrently:
```java
readLock.lock();
try {
    return cache.get(key);
} finally {
    readLock.unlock();
}
```
However, every read operation still incurs lock acquisition and release overhead. In a read-heavy system where updates are rare, **most reads are unnecessarily locking**.

Java designers asked: *“Can we read without actually acquiring a lock?”*
This is why **`StampedLock`** was introduced in Java 8.

---

## 2. What is StampedLock?

Initialized as:
```java
StampedLock lock = new StampedLock();
```

Unlike `ReadWriteLock` which returns separate lock objects (`lock.readLock()`), `StampedLock` methods return a **Stamp** (a `long` value).

```java
long stamp = lock.readLock();
```

Think of a **Stamp** as a:
* **Permission Token** / **Access Ticket**
* **Version Number**

To unlock, you must pass this stamp back:
```java
lock.unlock(stamp); // Verifies ownership using the stamp
```

---

## 3. StampedLock's Three Modes

`StampedLock` supports three distinct modes:

### Mode 1: Write Lock (Exclusive)
Exactly like `ReadWriteLock`'s write lock. It is exclusive: only one writer can enter, and all readers are blocked.
```java
long stamp = lock.writeLock();
try {
    cache.put(key, value);
} finally {
    lock.unlockWrite(stamp);
}
```

### Mode 2: Read Lock (Pessimistic / Shared)
Exactly like `ReadWriteLock`'s read lock. Multiple readers are allowed, but writers are blocked.
```java
long stamp = lock.readLock();
try {
    return cache.get(key);
} finally {
    lock.unlockRead(stamp);
}
```

### Mode 3: Optimistic Read
This is `StampedLock`'s signature feature. It **does not acquire a lock**.
```java
long stamp = lock.tryOptimisticRead(); // Returns version stamp without locking
```

#### How Optimistic Read Works:
1. **Acquire Stamp:** Suppose the internal lock version is `10`. `tryOptimisticRead()` returns `stamp = 10`.
2. **Read Data:** Read the shared variable/cache (e.g., `String value = cache.get("DB_URL");`).
3. **Validate Stamp:** Call `lock.validate(stamp)`.
   * **If no writer intervened:** The version remains `10`. Validation succeeds, and we return the value. No lock was ever acquired!
   * **If a writer intervened:** The version incremented to `11`. Validation fails (`validate` returns `false`). The reader must fall back to a pessimistic read lock to get a consistent view.

#### Canonical Optimistic Read Pattern:
```java
long stamp = lock.tryOptimisticRead();
String value = cache.get(key);

if (!lock.validate(stamp)) { // Check if data was modified
    // Fall back to a pessimistic read lock
    stamp = lock.readLock();
    try {
        value = cache.get(key);
    } finally {
        lock.unlockRead(stamp);
    }
}
return value;
```

#### Performance Advantage:
* **ReadWriteLock:** `Acquire Lock ➔ Read ➔ Release Lock` (for every single request).
* **StampedLock (Optimistic):** `Read ➔ Validate` (no lock contention, zero synchronization overhead unless a write occurs).

---

## 4. Advanced Feature: Lock Upgrades & Downgrades

### The Lock Upgrade Problem
In a cache-miss scenario, we want to:
1. Read the cache.
2. If the value is missing, load it from the database and write it to the cache.

With **`ReadWriteLock`**, direct upgrades from read to write are not supported. Doing so causes a deadlock:
```java
readLock.lock();
writeLock.lock(); // ❌ DEADLOCK!
```

To avoid deadlock, you must release and re-acquire:
```java
// ReadWriteLock Approach
readLock.lock();
try {
    String value = cache.get(key);
    if (value != null) return value;
} finally {
    readLock.unlock(); // Release read lock first
}

// ⚠️ GAP: Another thread could update the cache here!

writeLock.lock(); // Acquire write lock
try {
    String value = cache.get(key); // Must double-check!
    if (value == null) {
        value = loadFromDatabase();
        cache.put(key, value);
    }
    return value;
} finally {
    writeLock.unlock();
}
```
This **GAP** requires a double-checking pattern because the state might have changed between unlocking the read lock and acquiring the write lock.

### The StampedLock Solution: `tryConvertToWriteLock(stamp)`
`StampedLock` lets you attempt an atomic upgrade from a read lock to a write lock without releasing ownership:

```java
long stamp = lock.readLock();
try {
    String value = cache.get(key);
    if (value == null) {
        // Attempt atomic upgrade
        long writeStamp = lock.tryConvertToWriteLock(stamp);
        if (writeStamp != 0L) { // Success!
            stamp = writeStamp;
            cache.put(key, loadConfig());
        }
    }
} finally {
    lock.unlock(stamp);
}
```

#### Internal Mechanics of `tryConvertToWriteLock`:
* **Success:** If only the current thread holds the read lock (no other readers/writers), the lock state upgrades to a write lock immediately. `tryConvertToWriteLock()` returns a new write stamp, and no gap occurs.
* **Failure:** If other threads hold read locks, the upgrade fails and returns `0L`.

#### Complete Industry-Standard Cache Implementation (Handling Upgrade Failures):
```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.StampedLock;

public class ConfigCache {
    private final Map<String, String> cache = new HashMap<>();
    private final StampedLock lock = new StampedLock();

    public String getConfig(String key) {
        long stamp = lock.readLock();
        try {
            String value = cache.get(key);
            if (value != null) {
                return value;
            }

            // Attempt to upgrade to write lock
            long ws = lock.tryConvertToWriteLock(stamp);
            if (ws == 0L) {
                // Upgrade failed (other readers present). Fall back:
                lock.unlockRead(stamp);       // 1. Release read lock
                stamp = lock.writeLock();     // 2. Block and acquire write lock
            } else {
                stamp = ws;                   // Upgrade succeeded!
            }

            // Re-read data (always required if we had a fallback gap)
            value = cache.get(key);
            if (value == null) {
                value = loadFromDatabase(key);
                cache.put(key, value);
            }
            return value;
        } finally {
            lock.unlock(stamp); // Will release writeLock or readLock depending on stamp type
        }
    }

    private String loadFromDatabase(String key) {
        System.out.println("Loading from DB: " + key);
        return "VALUE_" + key;
    }
}
```

---

### Lock Downgrade: `tryConvertToReadLock(stamp)`
Just like downgrading from write to read lock in `ReadWriteLock`, `StampedLock` supports direct conversion:
```java
long stamp = lock.writeLock();
try {
    cache.put(key, "NEW_VALUE");
    
    // Atomically downgrade write lock to read lock
    long readStamp = lock.tryConvertToReadLock(stamp);
    if (readStamp != 0L) {
        stamp = readStamp;
    }
    
    String value = cache.get(key);
    System.out.println(value);
} finally {
    lock.unlock(stamp);
}
```
**Internal Flow:**
1. **Before:** Thread holds exclusive write lock.
2. **During:** Calls `tryConvertToReadLock(stamp)`. State transitions to read lock.
3. **After:** Other readers can now enter, while writers remain blocked.

---

## 5. Important Limitations

### StampedLock is NOT Reentrant
Unlike `ReentrantLock` and `ReentrantReadWriteLock`, `StampedLock` is **non-reentrant**. If a thread attempts to acquire the lock again while holding it, it can deadlock itself.

```java
void methodA() {
    long stamp = lock.writeLock();
    try {
        methodB(); // ❌ DEADLOCK!
    } finally {
        lock.unlockWrite(stamp);
    }
}

void methodB() {
    long stamp = lock.writeLock(); // Blocks indefinitely waiting for methodA to release the lock
    try {
        // Do work
    } finally {
        lock.unlockWrite(stamp);
    }
}
```
Because the lock structure doesn't track thread ownership (only stamp states), it cannot detect that the same thread is requesting re-entry.

---

## 6. When to Use StampedLock?

### Good Use Cases (`Reads >>> Writes`)
* High-read/low-write scenarios (e.g., caches, metadata services, feature flags, configuration tables).
* A feature flag cache queried 50,000 times/second but updated once a day is a perfect candidate.

### Bad Use Cases
* **Frequent Writes:** If writes are frequent (e.g., 50% reads / 50% writes), optimistic reads will constantly fail and fall back to pessimistic locks, offering no benefit.
* **Reentrancy Needed:** If calling recursive or nested methods that require lock acquisition.
* **Condition Variables:** StampedLock does not support `Condition` queues. Use `ReentrantLock` instead.

---

## 7. Industry Reality & Summary

Most production systems today rely on higher-level abstractions like `ConcurrentHashMap`, `Caffeine Cache`, `Redis`, or relational databases rather than manual lock management. 

However, understanding `StampedLock` (especially **Optimistic Reading**, **atomic conversions**, and **non-reentrancy**) is a key differentiator for high-performance Java positions, trading platforms, and low-latency system design.

### Comparison Table

| Feature              | ReadWriteLock                                  | StampedLock                             |
| :------------------- | :--------------------------------------------- | :-------------------------------------- |
| **Optimistic Read**  | ❌ Not Supported                                | ✅ Supported (`tryOptimisticRead()`)     |
| **Direct Upgrade**   | ❌ Requires unlock/relock dance (creates a gap) | ✅ Supported (`tryConvertToWriteLock()`) |
| **Direct Downgrade** | ✅ Supported                                    | ✅ Supported (`tryConvertToReadLock()`)  |
| **Reentrancy**       | ✅ Yes                                          | ❌ No                                    |
