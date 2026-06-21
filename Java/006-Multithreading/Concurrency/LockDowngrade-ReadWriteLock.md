# ReentrantReadWriteLock: Upgrade vs Downgrade

# Lock Upgrade (Read → Write)

## What is Upgrade?

A thread starts with a Read Lock:

```text
Read Cache
```

Then discovers that it must modify data:

```text
Cache Miss
```

Now it wants:

```text
Read Lock
    ↓
Write Lock
```

This transition is called:

```text
Lock Upgrade
```

---

# Why Upgrade Is Needed?

Imagine cache is empty.

```java
cache.get("DB_URL") == null
```

We must load value from database and insert it into cache.

```java
cache.put("DB_URL", loadFromDB());
```

Since `put()` modifies shared data, a Write Lock is required.

---

# Why Direct Upgrade Is Dangerous?

Suppose a developer writes code like this:

```java 
public String getConfig(String key) {

    readLock.lock();

    try {

        String value = cache.get(key);

        if (value == null) {

            // BAD: Trying to upgrade directly
            writeLock.lock();

            try {

                value = loadFromDB();

                cache.put(key, value);

            } finally {
                writeLock.unlock();
            }
        }

        return value;

    } finally {
        readLock.unlock();
    }
}
```

Consider:

```text
T1 -> Read Lock
T2 -> Read Lock
```

Both threads execute:

```java
String value = cache.get("DB_URL");
```

Both get:

```text
null
```

Now both try:

```java
writeLock.lock();
```

But Write Lock requires:

```text
No Readers
```

Current situation:

```text
T1 still holds Read Lock
T2 still holds Read Lock
```

Both are waiting for readers to disappear.

But they themselves are the readers.

```text
T1 waiting for T2
T2 waiting for T1
```

Result:

```text
Deadlock
```

For this reason:

```java
ReentrantReadWriteLock
```

does NOT support direct lock upgrade.

---

# Correct Upgrade Pattern

## Step 1

Acquire Read Lock.

```java
readLock.lock();
```

Read cache.

If value exists:

```java
return value;
```

Release Read Lock.

---

## Step 2

Acquire Write Lock.

Check again because another thread may have updated cache meanwhile.

If still absent:

```java
loadFromDB();
cache.put(...);
```

Return value.

---

# Complete Upgrade Example

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ConfigCache {

    private final Map<String, String> cache = new HashMap<>();

    private final ReentrantReadWriteLock rwLock =
            new ReentrantReadWriteLock();

    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();

    public String getConfig(String key) {

        // ------------------------
        // First attempt with read lock
        // ------------------------
        readLock.lock();

        try {

            String value = cache.get(key);

            if (value != null) {
                System.out.println("Read from cache");
                return value;
            }

        } finally {
            readLock.unlock();
        }

        // ------------------------
        // Upgrade by releasing read lock
        // and acquiring write lock
        // ------------------------
        writeLock.lock();

        try {

            // Double-check
            String value = cache.get(key);

            if (value == null) {

                System.out.println("Loading from DB...");

                value = loadFromDB(key);

                cache.put(key, value);
            }

            return value;

        } finally {
            writeLock.unlock();
        }
    }

    private String loadFromDB(String key) {
        return "jdbc:mysql://localhost:3306/mydb";
    }

    public static void main(String[] args) {

        ConfigCache cache = new ConfigCache();

        System.out.println(cache.getConfig("DB_URL"));

        System.out.println(cache.getConfig("DB_URL"));
    }
}
```

---

# Why Double-Check Is Necessary?

Imagine:

```text
T1 releases Read Lock
```

Before T1 acquires Write Lock:

```text
T2 acquires Write Lock
```

T2 loads data:

```java
cache.put(...)
```

Now T1 gets Write Lock.

Without checking again:

```java
loadFromDB()
```

would execute twice.

Therefore:

```java
String value = cache.get(key);

if(value == null)
```

must be checked again.

This is called:

```text
Double Check
```

---

# Lock Downgrade (Write → Read)

## What is Downgrade?

A thread currently owns:

```text
Write Lock
```

After finishing modification it wants to continue reading safely.

So it transitions:

```text
Write Lock
    ↓
Read Lock
```

This is called:

```text
Lock Downgrading
```

---

# Why Is Downgrade Useful?

Suppose:

```java
cache.put("DB_URL", value);
```

After updating cache, the thread wants to read the newly inserted value.

If it simply releases Write Lock:

```text
Release Write Lock
```

another writer may enter immediately.

```text
T2 modifies cache
```

Now the original thread reads different data.

Consistency is lost.

---

# Correct Downgrade Pattern

While holding Write Lock:

Acquire Read Lock.

```java
readLock.lock();
```

Then release Write Lock.

```java
writeLock.unlock();
```

Now thread still owns:

```text
Read Lock
```

No writer can modify data while the thread continues reading.

---

# Complete Downgrade Example

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class CacheRefreshExample {

    private final Map<String, String> cache = new HashMap<>();

    private final ReentrantReadWriteLock rwLock =
            new ReentrantReadWriteLock();

    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();

    public String refreshAndRead(String key) {

        writeLock.lock();

        try {

            System.out.println("Loading latest value from DB");

            String value = loadFromDB(key);

            cache.put(key, value);

            // Downgrade starts here
            readLock.lock();

        } finally {

            // Release write lock
            writeLock.unlock();
        }

        try {

            System.out.println("Reading after downgrade");

            return cache.get(key);

        } finally {

            readLock.unlock();
        }
    }

    private String loadFromDB(String key) {
        return "jdbc:mysql://localhost:3306/production";
    }

    public static void main(String[] args) {

        CacheRefreshExample cache =
                new CacheRefreshExample();

        String value =
                cache.refreshAndRead("DB_URL");

        System.out.println(value);
    }
}
```

---

# Internal Lock State During Downgrade

### Step 1

```text
T1 -> Write Lock
```

Readers:

```text
0
```

Writers:

```text
1
```

---

### Step 2

Acquire Read Lock while still holding Write Lock.

```text
T1 -> Write Lock
T1 -> Read Lock
```

Readers:

```text
1
```

Writers:

```text
1
```

This is allowed because the lock is reentrant.

---

### Step 3

Release Write Lock.

```text
T1 -> Read Lock
```

Readers:

```text
1
```

Writers:

```text
0
```

Now other readers may enter.

But writers must wait.

---

# Why Upgrade Fails But Downgrade Works

## Upgrade

```text
Read
  ↓
Write
```

Problem:

```text
Multiple readers may exist
```

A Write Lock requires:

```text
Readers = 0
```

Deadlock becomes possible.

Therefore:

```text
Not supported
```

---

## Downgrade

```text
Write
  ↓
Read
```

Problem?

None.

Because:

```text
Only one writer exists
```

The writer already has exclusive ownership.

It can safely acquire a Read Lock before releasing the Write Lock.

Therefore:

```text
Fully supported
```

---

# Relation With StampedLock

`StampedLock` was introduced partly to solve the awkward upgrade process.

Instead of:

```text
Read Lock
Release
Write Lock
```

you can attempt:

```java
long writeStamp =
    lock.tryConvertToWriteLock(readStamp);
```

If conversion succeeds:

```text
Read → Write
```

happens atomically.

No release-and-reacquire cycle.

This is one of the biggest advantages of `StampedLock` over `ReentrantReadWriteLock`.
