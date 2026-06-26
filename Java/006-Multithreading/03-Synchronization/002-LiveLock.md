
---

# What is LiveLock?

A **LiveLock** is a condition where **multiple threads are not blocked**, but they **keep changing their state in response to each other**, so **none of them can make progress**.

Think of it as:

> **Threads are alive, running, consuming CPU, but useful work never finishes.**

Unlike deadlock, the threads are continuously executing.

---

# Simple Definition

> A LiveLock occurs when two or more threads continuously react to each other's actions, repeatedly changing their state without completing their intended work.

---

# Real Life Example

Imagine a narrow hallway.

Two people are walking toward each other.

```
          Hallway

    Person A   ---> <---   Person B
```

Both want to avoid collision.

---

### Step 1

A moves left.

```
Left

A
|
|
|
B
```

---

### Step 2

B is polite.

B also moves left.

```
Left

A
|
|
|
B
```

Still blocked.

---

### Step 3

A says

> "Oops"

Moves right.

```
Right

A
|
|
|
B
```

---

### Step 4

B also moves right.

```
Right

A
|
|
|
B
```

Still blocked.

---

This continues forever.

Nobody stops.

Nobody is waiting.

Everybody is moving.

But nobody reaches the destination.

This is **LiveLock.**

---

# Visualization

```
Iteration 1

A -> Left
B -> Left

Blocked

Iteration 2

A -> Right
B -> Right

Blocked

Iteration 3

A -> Left
B -> Left

Blocked

Iteration 4

A -> Right
B -> Right

Blocked

...
Forever
```

---

# Why does LiveLock happen?

Usually because

```
Thread A
↓

detects conflict

↓

changes behavior

↓

Thread B also detects conflict

↓

changes behavior

↓

Conflict still exists

↓

Repeat forever
```

Both threads are

* polite
* cooperative
* constantly reacting

Instead of solving the problem, they keep recreating it.

---

# Characteristics of LiveLock

* Threads are NOT blocked
* Threads are continuously running
* CPU utilization is high
* State keeps changing
* Useful work never completes
* Progress = 0%

---

# Code Example

```java
public class P_LiveLockDemo {

    static volatile boolean personAOnLeft = true;
    static volatile boolean personBOnLeft = true;

    public static void main(String[] args) {

        Thread personA = new Thread(() -> {

            while (true) {

                if (personAOnLeft == personBOnLeft) {

                    System.out.println("A: You go first.");
                    personAOnLeft = !personAOnLeft;

                    try {
                        Thread.sleep(500);
                    } catch (Exception e) {}
                }
                else {
                    System.out.println("A Passed");
                    break;
                }
            }
        });

        Thread personB = new Thread(() -> {

            while (true) {

                if (personAOnLeft == personBOnLeft) {

                    System.out.println("B: No, you go first.");
                    personBOnLeft = !personBOnLeft;

                    try {
                        Thread.sleep(500);
                    } catch (Exception e) {}
                }
                else {
                    System.out.println("B Passed");
                    break;
                }
            }
        });

        personA.start();
        personB.start();
    }
}

/*
Classic Hallway Example
A and B are walking toward each other.

A sees B
A moves left

B sees A
B also moves left

Still blocked

A moves right

B also moves right

Still blocked

and

so on
* */
```

Variables

```java
personAOnLeft = true
personBOnLeft = true
```

Initially

```
A = Left
B = Left
```

---

## First Iteration

Condition

```java
if(personAOnLeft == personBOnLeft)
```

Both are

```
true == true
```

Condition true.

---

A executes

```java
personAOnLeft = false;
```

Now

```
A = Right
B = Left
```

---

Suppose B executes immediately afterward.

B also toggles

```java
personBOnLeft = false;
```

Now

```
A = Right
B = Right
```

Again

```
Both same side
```

Next iteration

Both change again.

```
A = Left
B = Left
```

Again same.

Forever.

---

Visualization

```
Initial

A = Left
B = Left

↓

Both switch

A = Right
B = Right

↓

Both switch

A = Left
B = Left

↓

Both switch

A = Right
B = Right

↓

Forever
```

Nobody passes.

---

# Why are `volatile` variables used?

```java
static volatile boolean personAOnLeft;
static volatile boolean personBOnLeft;
```

Without `volatile`

Each thread may cache values.

```
CPU Cache

A Thread

personA = Left

personB = Left
```

Other thread changes value.

Cache still contains old value.

Then each thread sees different data.

Your LiveLock demonstration becomes unreliable.

---

`volatile` guarantees

* latest value
* visibility
* no stale cache

It does **not** solve LiveLock.

It only makes the demo behave correctly.

---

# Why sleep is added?

Without

```java
Thread.sleep(500)
```

The loop runs millions of times.

Console floods instantly.

CPU becomes nearly 100%.

Adding sleep slows the visualization.

---

# Why Random Delay Solves LiveLock

Instead of

```
A changes immediately

B changes immediately
```

We introduce randomness.

Example

```
Random

A waits 150 ms

B waits 800 ms
```

Timeline

```
0 ms

A sleeping

B sleeping

150 ms

A wakes

Changes side

Now

A = Right

B = Left

Conflict removed

A passes

800 ms

B wakes

Now sees

A != B

B passes
```

Because they no longer react **at exactly the same time**, one thread gets ahead and breaks the repeating pattern.

This is similar to network protocols where devices wait for a **random backoff** period before retrying, reducing repeated collisions.


# Code Example : 

```java
public class P_LiveLockSolved {

    static volatile boolean personAOnLeft = true;
    static volatile boolean personBOnLeft = true;

    public static void main(String[] args) {

        Random random = new Random();

        Thread personA = new Thread(() -> {

            while (true) {

                if (personAOnLeft == personBOnLeft) {

                    System.out.println("A: You go first.");

                    try {
                        Thread.sleep(random.nextInt(1000));
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }

                    personAOnLeft = !personAOnLeft;
                } else {

                    System.out.println("A Passed");
                    break;
                }
            }
        });

        Thread personB = new Thread(() -> {

            while (true) {

                if (personAOnLeft == personBOnLeft) {

                    System.out.println("B: No, you go first.");

                    try {
                        Thread.sleep(random.nextInt(1000));
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }

                    personBOnLeft = !personBOnLeft;
                } else {

                    System.out.println("B Passed");
                    break;
                }
            }
        });

        personA.start();
        personB.start();
    }
}

/*

Without delay:

Time 0:
A switches side
B switches side

Time 1:
A switches side
B switches side

Again collision

With random delay:
A waits 200 ms
B waits 700 ms

A changes side first

Now:
A = Right
B = Left
* */
```

---

# Why does Random Delay work?

Without randomness

```
A ----Toggle-------

B ----Toggle-------

Perfect synchronization
```

With randomness

```
A -----Toggle--------------

B ------------Toggle--------

Synchronization broken
```

Now both threads stop copying each other's behavior.

---

# Is Random Delay the only solution?

No.

Common solutions include:

* Random backoff (most common)
* Retry with exponential backoff
* One thread yields while the other proceeds
* Assign priorities (one thread always gets preference)
* Introduce a coordinator/arbitrator
* Change the algorithm to avoid mutual reactions

---

# Industrial Example 1 — Database Transaction Retry

Suppose two microservices update the same database row.

```
Inventory Service

↓

Order Service
```

Both use optimistic locking.

---

Thread A

```
Read Version = 5
```

Thread B

```
Read Version = 5
```

Both try to update.

One succeeds.

The other fails.

---

Now both retry immediately.

Again

```
Read same version

↓

Conflict

↓

Retry immediately

↓

Conflict again

↓

Retry

↓

Conflict

↓

Forever
```

Both services are active but make no progress.

This can become a LiveLock.

### Solution

Instead of retrying immediately:

```text
Retry after 100 ms

Retry after 250 ms

Retry after 700 ms
```

or use **exponential backoff with jitter**.

This is a standard approach in distributed systems because it reduces repeated collisions.

---

# Industrial Example 2 — Message Queue Consumers

Two consumers process the same message.

```
Consumer A

↓

Cannot process

↓

Requeue

Consumer B

↓

Cannot process

↓

Requeue
```

Message keeps bouncing.

Nobody processes it.

Consumers remain active.

System makes no progress.

### Solution

* Add retry limits.
* Use delayed retries.
* Send permanently failing messages to a Dead Letter Queue (DLQ).

---

# Industrial Example 3 — Distributed Lock

Two application servers compete for a distributed lock.

```
Server A

↓

Lock unavailable

↓

Release

↓

Retry

Server B

↓

Lock unavailable

↓

Release

↓

Retry
```

Both repeatedly retry in sync.

Neither performs the work.

### Solution

* Random retry intervals.
* Exponential backoff.
* Fair lock implementation.
* Lease-based distributed locks.

---

# Detecting LiveLock

Symptoms include:

* Threads remain in the `RUNNABLE` state.
* CPU usage stays high.
* Application appears hung even though threads are executing.
* Thread dumps show no blocked threads, but the same methods repeat continuously.
* Logs repeatedly print the same retry or "try again" messages.

---

# Best Practices to Avoid LiveLock

* Avoid symmetric behavior where every thread reacts identically.
* Add randomized delays before retries.
* Use exponential backoff for repeated failures.
* Prefer well-tested concurrency utilities (`Lock`, `Semaphore`, queues, etc.) over custom coordination logic.
* Limit retry attempts and fail gracefully if progress cannot be made.
* Design protocols so one participant can eventually proceed instead of everyone continuously yielding.

---

# DeadLock vs LiveLock

| Feature           | DeadLock                 | LiveLock                            |
| ----------------- | ------------------------ | ----------------------------------- |
| Thread State      | Waiting / Blocked        | Running                             |
| CPU Usage         | Usually low              | Usually high                        |
| Locks Held        | Yes                      | Usually yes or continuously retried |
| State Changes     | No                       | Yes                                 |
| Progress          | No                       | No                                  |
| Threads Alive     | Yes                      | Yes                                 |
| Threads Executing | No                       | Yes                                 |
| Easy to Detect    | Easier (blocked threads) | Harder (busy threads)               |

---

## DeadLock

```
Thread A

holds Lock1

waiting Lock2

----------------

Thread B

holds Lock2

waiting Lock1
```

Result

```
Nobody moves.
```

---

## LiveLock

```
Thread A

"You go."

↓

Thread B

"No, you go."

↓

Thread A

"You go."

↓

Thread B

"No, you go."

↓

Forever
```

Result

```
Everybody moves.

Nobody progresses.
```

---

# DeadLock vs LiveLock Visualization

### DeadLock

```
Thread A
   |
holds Lock 1
   |
waiting Lock 2

-------------------

Thread B
   |
holds Lock 2
   |
waiting Lock 1

Everything stops.
```

### LiveLock

```
Thread A

Move Left

↓

Move Right

↓

Move Left

↓

Move Right

↓

Forever

--------------------

Thread B

Move Left

↓

Move Right

↓

Move Left

↓

Move Right

↓

Forever
```

Threads remain active, but the application never completes the intended work.

---
