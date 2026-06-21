Since you are already learning `ReentrantLock`, `ReadWriteLock`, and `StampedLock`, understanding **Semaphore** becomes much easier if we first understand **what problem existed before Semaphore**.

---

# Problem Statement

Imagine you have a parking lot.

```text
Parking Lot Capacity = 3 Cars
```

If 10 cars arrive:

```text
Car-1 -> Enter
Car-2 -> Enter
Car-3 -> Enter

Car-4 -> Wait
Car-5 -> Wait
...
Car-10 -> Wait
```

Only **3 cars** can be inside simultaneously.

When one car leaves:

```text
Car-4 -> Enter
```

---

## Can synchronized solve this?

Yes, but not efficiently.

```java
synchronized void enterParking() {
   // only ONE thread allowed
}
```

This means:

```text
Car-1 enters
Car-2 waits
Car-3 waits
```

But our requirement is:

```text
Allow 3 threads together
Not 1 thread
```

So `synchronized` is too restrictive.

---

# What Semaphore Solves

Semaphore controls:

```text
How many threads can access a resource simultaneously.
```

Instead of:

```text
1 thread
```

we can allow:

```text
2 threads
5 threads
10 threads
100 threads
```

depending on requirement.

---

# Real World Examples

## Database Connection Pool

Suppose:

```text
DB Connections = 20
```

Application receives:

```text
100 requests
```

Only:

```text
20 requests
```

can get DB connection.

Remaining:

```text
80 requests wait
```

This is classic Semaphore use case.

---

## API Rate Limiting

Suppose external payment gateway allows:

```text
10 concurrent requests
```

Semaphore:

```java
Semaphore semaphore = new Semaphore(10);
```

ensures only 10 threads call API simultaneously.

---

## File Download Server

```text
Allow max 50 downloads together
```

Semaphore perfectly fits.

---

# What Is Semaphore Internally?

Semaphore maintains a counter.

Example:

```java
Semaphore semaphore = new Semaphore(3);
```

means:

```text
Available Permits = 3
```

Permit = Permission to enter.

---

Initial State:

```text
Permits = 3
```

---

Thread-1

```java
semaphore.acquire();
```

Counter becomes:

```text
Permits = 2
```

---

Thread-2

```java
acquire()
```

```text
Permits = 1
```

---

Thread-3

```java
acquire()
```

```text
Permits = 0
```

---

Thread-4

```java
acquire()
```

Now:

```text
Permits = 0
```

Thread-4 blocks.

```text
WAITING
```

until somebody releases permit.

---

Thread-1 finishes:

```java
semaphore.release();
```

Counter:

```text
Permits = 1
```

Now waiting Thread-4 gets permit.

---

# Important Methods

## acquire()

Take permit.

```java
semaphore.acquire();
```

If permit unavailable:

```text
Thread waits.
```

---

## release()

Return permit.

```java
semaphore.release();
```

---

## availablePermits()

```java
System.out.println(
        semaphore.availablePermits());
```

Returns:

```text
Current free permits
```

---

## tryAcquire()

```java
if(semaphore.tryAcquire()) {
   // got permit
}
```

Doesn't wait.

Returns:

```text
true
false
```

immediately.

---

# Full Example

Parking lot with 3 slots.

```java
import java.util.concurrent.Semaphore;

public class ParkingLot {

    private static final Semaphore semaphore =
            new Semaphore(3);

    public static void parkCar(String carName) {

        try {
            System.out.println(carName + " waiting");

            semaphore.acquire();

            System.out.println(
                    carName + " entered parking");

            Thread.sleep(5000);

            System.out.println(
                    carName + " leaving parking");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            semaphore.release();
        }
    }

    public static void main(String[] args) {

        for (int i = 1; i <= 10; i++) {

            int id = i;

            new Thread(() ->
                    parkCar("Car-" + id)
            ).start();
        }
    }
}
```

Output:

```text
Car-1 entered
Car-2 entered
Car-3 entered

Car-4 waiting
Car-5 waiting
...

After 5 sec

Car-1 leaving

Car-4 entered
```

Only 3 cars are inside at any moment.

---

# Binary Semaphore

Semaphore can also be:

```java
new Semaphore(1);
```

Only one permit.

```text
0 or 1
```

This is called:

```text
Binary Semaphore
```

Works similar to lock.

---

Example:

```java
Semaphore semaphore =
        new Semaphore(1);
```

Only one thread can enter.

---

# Difference Between Lock and Semaphore

## ReentrantLock

```java
Lock lock = new ReentrantLock();
```

```text
Only ONE thread enters.
```

---

## Semaphore(5)

```java
Semaphore semaphore =
        new Semaphore(5);
```

```text
Five threads enter together.
```

---

# Fair vs Non-Fair Semaphore

## Non-Fair (Default)

```java
Semaphore semaphore =
        new Semaphore(3);
```

Thread order not guaranteed.

```text
T1 waiting
T2 waiting
T3 waiting

Permit released

T3 may get it first
```

---

## Fair Semaphore

```java
Semaphore semaphore =
        new Semaphore(3, true);
```

FIFO order.

```text
T1 waiting
T2 waiting
T3 waiting

Permit released

T1 gets permit
```

---

# Internal Working

Semaphore is built on top of:

```text
AQS
(AbstractQueuedSynchronizer)
```

Same foundation used by:

```text
ReentrantLock
CountDownLatch
ReentrantReadWriteLock
Semaphore
```

Internally AQS stores:

```text
state = permits
```

Example:

```java
new Semaphore(3)
```

AQS state:

```text
state = 3
```

Acquire:

```text
CAS(state,3→2)
```

Acquire:

```text
CAS(state,2→1)
```

Acquire:

```text
CAS(state,1→0)
```

Acquire again:

```text
Fail
Thread enters AQS wait queue
```

Release:

```text
state++
Wake waiting thread
```

---

# Industrial Example

Suppose your Spring Boot application has:

```text
1000 incoming requests
```

But external SMS provider only allows:

```text
20 concurrent requests
```

Service:

```java
@Service
public class SmsService {

    private final Semaphore semaphore =
            new Semaphore(20);

    public void sendSms(String number)
            throws Exception {

        semaphore.acquire();

        try {
            callSmsProvider(number);
        } finally {
            semaphore.release();
        }
    }
}
```

Now:

```text
1000 requests arrive
```

Only:

```text
20 threads
```

call SMS provider simultaneously.

Others wait.

This protects:

```text
External APIs
Database connections
Redis connections
File systems
Limited resources
```

---

# When To Use Semaphore?

Use Semaphore when your goal is:

```text
Limit concurrent access to N resources.
```

Examples:

✅ Database connection pool

✅ API rate limiting

✅ Download manager

✅ Printer pool

✅ Parking lot

✅ Thread throttling

Do NOT use Semaphore when your goal is:

```text
Protect critical section from multiple threads.
```

For that use:

```java
synchronized
ReentrantLock
```

---

### One-line summary

A **Lock** answers:

```text
"How can only one thread enter?"
```

A **Semaphore** answers:

```text
"How can exactly N threads enter simultaneously?"
```

That single difference is the core reason Semaphore exists.

--

