
# StampedLock

```text
Problem 1 -> synchronized
Problem 2 -> ReentrantLock
Problem 3 -> ReadWriteLock
Problem 4 -> StampedLock
```

Every new lock was created because the previous one had limitations.

---

# Why Was StampedLock Introduced?

Let's revisit our cache example.

```java
Map<String, Config> cache;
```

Traffic:

```text
10000 Reads/sec
10 Writes/sec
```

This is called a:

```text
Read-heavy system
```

Examples:

* Configuration Cache
* Product Catalog
* Feature Flags
* User Permissions Cache
* Routing Metadata

---

## ReadWriteLock Solution

```java
readLock.lock();

try {
    return cache.get(key);
} finally {
    readLock.unlock();
}
```

Multiple readers can enter.

Great.

---

But there is still a problem.

Every read operation does:

```text
Acquire lock
Read data
Release lock
```

Even if:

```text
Nobody is writing
```

we are still paying lock acquisition cost.

---

Imagine:

```text
10000 Reads/sec
1 Write/minute
```

Most reads are unnecessarily locking.

Java designers thought:

> "Can we read without actually taking a lock?"

That's where `StampedLock` was born.

---

# What is StampedLock?

Java 8 introduced:

```java
StampedLock lock = new StampedLock();
```

Unlike ReadWriteLock:

```java
lock.readLock()
lock.writeLock()
```

it returns a:

```text
Stamp
```

which is a long value.

Example:

```java
long stamp = lock.readLock();
```

Think of stamp as:

```text
Permission Token
```

or

```text
Version Number
```

---

# StampedLock Supports 3 Modes

```text
1. Write Lock
2. Read Lock
3. Optimistic Read
```

---

# 1. Write Lock

Exactly like ReadWriteLock.

```java
long stamp = lock.writeLock();

try {

    cache.put(key, value);

} finally {

    lock.unlockWrite(stamp);
}
```

Rules:

```text
One writer only
No readers
```

---

# 2. Read Lock

Exactly like ReadWriteLock.

```java
long stamp = lock.readLock();

try {

    return cache.get(key);

} finally {

    lock.unlockRead(stamp);
}
```

Multiple readers allowed.

---

Nothing new so far.

The magic starts now.

---

# 3. Optimistic Read

This is the feature that made StampedLock famous.

---

Imagine:

```text
10000 Reads/sec
1 Write/minute
```

Most reads happen when:

```text
Nobody is writing
```

Why acquire a lock at all?

---

Instead:

```java
long stamp = lock.tryOptimisticRead();
```

This DOES NOT acquire a lock.

Read again:

```text
No lock is acquired.
```

---

Now read data.

```java
String value = cache.get("DB_URL");
```

---

Then validate:

```java
if (!lock.validate(stamp)) {

    // somebody modified data

}
```

---

# How Does It Work?

Suppose:

```text
Version = 10
```

Thread starts optimistic read.

```java
long stamp = lock.tryOptimisticRead();
```

Stamp contains:

```text
10
```

---

Thread reads data.

Meanwhile:

```text
Writer updates cache
```

Version becomes:

```text
11
```

---

Now:

```java
lock.validate(stamp);
```

checks:

```text
Is Version Still 10?
```

Answer:

```text
No
```

Validation fails.

---

Thread retries using proper read lock.

---

# Real Flow

```java
long stamp = lock.tryOptimisticRead();

String value = cache.get(key);

if (!lock.validate(stamp)) {

    stamp = lock.readLock();

    try {
        value = cache.get(key);
    } finally {
        lock.unlockRead(stamp);
    }
}

return value;
```

This is the most common StampedLock pattern.

---

# Why Is This Faster?

ReadWriteLock:

```text
Acquire Lock
Read
Release Lock
```

Every request.

---

StampedLock Optimistic Read:

```text
Read
Validate
Done
```

No lock acquisition.

Much less contention.

---

# Cache Example

Imagine:

```text
Feature Flag Cache
```

```java
isNewDashboardEnabled()
```

called:

```text
50,000 times/sec
```

but updated:

```text
once per day
```

Perfect StampedLock candidate.

---

# Lock Upgrade Problem Solved

Remember ReadWriteLock?

This was dangerous:

```java
readLock.lock();

writeLock.lock();
```

Deadlock risk.

---

StampedLock provides:

```java
tryConvertToWriteLock()
```

---

Example:

```java
long stamp = lock.readLock();

if (cache.get(key) == null) {

    long writeStamp =
            lock.tryConvertToWriteLock(stamp);

}
```

Java attempts:

```text
Read Lock
    ↓
Write Lock
```

safely.

---

If conversion succeeds:

```java
stamp = writeStamp;
```

Now you are writer.

No unlock/relock dance.

---

# Full Example

```java
long stamp = lock.readLock();

try {

    if (cache.get(key) == null) {

        long ws = lock.tryConvertToWriteLock(stamp);

        if (ws != 0L) {

            stamp = ws;

            cache.put(key, loadConfig());

        }
    }

} finally {

    lock.unlock(stamp);

}
```

---

# Why "Stamped"?

Because every operation returns:

```java
long stamp
```

Examples:

```java
long stamp1 = lock.readLock();

long stamp2 = lock.writeLock();

long stamp3 = lock.tryOptimisticRead();
```

Think of stamp as:

```text
Access Ticket
```

To unlock:

```java
lock.unlock(stamp);
```

Java verifies:

```text
Did you really own this lock?
```

using the stamp.

---

# Important Limitation

Unlike ReentrantLock:

```java
lock.lock();

methodA();

methodB();
```

same thread can re-enter.

---

StampedLock is:

```text
NOT Reentrant
```

---

This fails conceptually:

```java
methodA() {

    stamp = lock.writeLock();

    methodB();
}

methodB() {

    lock.writeLock(); // deadlock risk
}
```

Because StampedLock doesn't know:

```text
Same thread already owns lock
```

---

# When Should You Use StampedLock?

### Good Cases

```text
Reads >>>>> Writes
```

Examples:

* Cache
* Metadata Service
* Product Catalog
* Feature Flags
* Routing Tables
* In-memory Configuration

---

### Bad Cases

```text
Writes frequent
```

Example:

```text
50% Read
50% Write
```

No real benefit.

---

### Bad Cases

When you need:

```text
Reentrancy
Condition Variables
Complex Locking Logic
```

Use `ReentrantLock` instead.

---

# Industry Reality

Many developers know:

```text
synchronized
ReentrantLock
ReadWriteLock
```

Very few have actually used:

```text
StampedLock
```

because most production systems today rely on:

```text
ConcurrentHashMap
Caffeine Cache
Redis
Database
```

instead of manually managing locks.

However, if you're interviewing for senior backend, high-performance Java, trading systems, or concurrency-heavy roles, understanding `StampedLock` and especially:

```text
Optimistic Read
tryConvertToWriteLock()
Non-Reentrant nature
```

immediately signals that you understand concurrency beyond the usual Spring Boot CRUD level.

The next thing you should learn is **how StampedLock is implemented internally using state bits and versioning**, because that explains why optimistic reads are possible without taking a real lock.



----



Perfect. This is actually one of the biggest reasons `StampedLock` was introduced.

Let's compare `ReadWriteLock` and `StampedLock` using the **same cache example**.

---

# Problem in ReadWriteLock

Suppose we have a cache:

```java
private final Map<String, String> cache = new HashMap<>();
```

Goal:

```text
1. Read cache
2. If value exists → return
3. If value missing → load from DB
4. Store in cache
5. Return value
```

---

## ReadWriteLock Approach

Start with read lock.

```java
readLock.lock();

try {

    String value = cache.get(key);

    if(value != null) {
        return value;
    }

} finally {
    readLock.unlock();
}
```

Cache miss.

Need write access.

Unfortunately:

```java
writeLock.lock();
```

cannot be acquired while holding read lock.

So we must:

```text
Release Read Lock
      ↓
Acquire Write Lock
```

---

Full code:

```java
readLock.lock();

try {

    String value = cache.get(key);

    if(value != null) {
        return value;
    }

} finally {
    readLock.unlock();
}

writeLock.lock();

try {

    String value = cache.get(key);

    if(value == null) {

        value = loadFromDatabase();

        cache.put(key, value);
    }

    return value;

} finally {
    writeLock.unlock();
}
```

---

Notice this gap:

```text
Release Read Lock
      ↓
      GAP
      ↓
Acquire Write Lock
```

During this gap:

```text
Another thread may update cache
Another thread may insert value
Another thread may remove value
```

Therefore we must:

```java
cache.get(key)
```

again.

This is called:

```text
Double-checking
```

---

# How StampedLock Solves This

StampedLock provides:

```java
tryConvertToWriteLock()
```

which attempts:

```text
Read Lock
      ↓
Write Lock
```

without releasing ownership first.

---

## Complete Example

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.StampedLock;

public class ConfigCache {

    private final Map<String, String> cache =
            new HashMap<>();

    private final StampedLock lock =
            new StampedLock();

    public String getConfig(String key) {

        long stamp = lock.readLock();

        try {

            String value = cache.get(key);

            if (value != null) {
                return value;
            }

            // Cache Miss

            long writeStamp =
                    lock.tryConvertToWriteLock(stamp);

            if (writeStamp != 0L) {

                stamp = writeStamp;

                value = loadFromDatabase(key);

                cache.put(key, value);

                return value;
            }

        } finally {

            lock.unlock(stamp);
        }

        return null;
    }

    private String loadFromDatabase(String key) {

        System.out.println(
                "Loading from DB : " + key);

        return "VALUE_" + key;
    }
}
```

---

# What Happens Internally?

Suppose:

```text
Cache Empty
```

---

Thread T1:

```java
long stamp = lock.readLock();
```

State:

```text
Readers = 1
```

---

Reads cache:

```java
cache.get("DB_URL");
```

Result:

```text
null
```

---

Needs write access.

Calls:

```java
lock.tryConvertToWriteLock(stamp);
```

---

Since:

```text
Only T1 is reading
No other readers
No writers
```

conversion succeeds.

State changes:

```text
Read Lock
    ↓
Write Lock
```

without unlocking.

---

No gap exists.

```text
SAFE
```

---

# When Conversion Fails

Imagine:

```text
T1 → Read Lock
T2 → Read Lock
```

Both reading.

---

T1 tries:

```java
lock.tryConvertToWriteLock(stamp);
```

---

Can Java give write lock?

No.

Because:

```text
T2 still reading
```

Writer requires:

```text
Readers = 0
```

---

Result:

```java
writeStamp = 0
```

---

Meaning:

```text
Upgrade Failed
```

---

Then we do fallback logic.

---

Production-style code:

```java
long writeStamp =
        lock.tryConvertToWriteLock(stamp);

if (writeStamp == 0L) {

    lock.unlockRead(stamp);

    stamp = lock.writeLock();

} else {

    stamp = writeStamp;
}
```

This is the typical pattern used in real applications.

---

# Complete Industry Version

```java
public String getConfig(String key) {

    long stamp = lock.readLock();

    try {

        String value = cache.get(key);

        if (value != null) {
            return value;
        }

        long ws =
                lock.tryConvertToWriteLock(stamp);

        if (ws == 0L) {

            lock.unlockRead(stamp);

            stamp = lock.writeLock();

        } else {

            stamp = ws;
        }

        value = cache.get(key);

        if (value == null) {

            value = loadFromDatabase(key);

            cache.put(key, value);
        }

        return value;

    } finally {

        lock.unlock(stamp);
    }
}
```

This is very close to what you might see in a real cache implementation.

---

# What About Downgrade?

ReadWriteLock already supports downgrade.

StampedLock supports it too.

---

Suppose cache refresh completed.

```java
long stamp = lock.writeLock();

try {

    cache.put(key, value);

}
```

Now we want:

```text
Write Lock
      ↓
Read Lock
```

---

Use:

```java
long readStamp =
        lock.tryConvertToReadLock(stamp);
```

---

Example:

```java
long stamp = lock.writeLock();

try {

    cache.put(key, "NEW_VALUE");

    stamp =
            lock.tryConvertToReadLock(stamp);

    String value = cache.get(key);

    System.out.println(value);

} finally {

    lock.unlock(stamp);
}
```

---

# Internal Flow

Before conversion:

```text
T1 -> Write Lock
```

After:

```text
T1 -> Read Lock
```

Now:

```text
Other readers may enter
Writers still blocked
```

Exactly what we want.

---

# Why Is StampedLock Better?

### ReadWriteLock

```text
Read
 ↓
Need Write
 ↓
Release Read
 ↓
Acquire Write
 ↓
Re-check data
```

Awkward and error-prone.

---

### StampedLock

```text
Read
 ↓
tryConvertToWriteLock()
 ↓
Success
 ↓
Continue
```

No gap.

No unlock/relock.

No deadlock risk.

---

# Interview Summary

### Upgrade

ReadWriteLock:

```text
Read → Write
```

❌ Direct upgrade not supported

Must:

```text
Unlock Read
Lock Write
```

---

StampedLock:

```java
tryConvertToWriteLock()
```

✅ Safe upgrade attempt

Returns:

```text
New Stamp -> Success

0 -> Failed
```

---

### Downgrade

ReadWriteLock:

```text
Acquire Read
Release Write
```

✅ Supported

---

StampedLock:

```java
tryConvertToReadLock()
```

✅ Direct conversion

---

This upgrade/downgrade capability, combined with **optimistic reads**, is what makes `StampedLock` the most sophisticated lock in the Java standard library for read-heavy workloads.

---


