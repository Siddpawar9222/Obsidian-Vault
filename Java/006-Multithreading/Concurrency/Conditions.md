
---

## 1. The Producer-Consumer Problem

The Producer-Consumer problem is the classic concurrency design problem. Understanding it helps you master threads and condition-based signaling.

### 1.1 What is the Problem?

Two types of threads share a fixed-size, common buffer:

| Thread | Action | Blocked When... |
|---|---|---|
| **Producer** | Creates items and puts them in the buffer | Buffer is **FULL** (must wait for space) |
| **Consumer** | Takes items from the buffer and processes them | Buffer is **EMPTY** (must wait for items) |

### 1.2 The Flow

```text
  Producer                  Buffer (size = 3)          Consumer
  --------                  -----------------          --------
  put(item1)  -->           [ item1 ]
  put(item2)  -->           [ item1, item2 ]
  put(item3)  -->           [ item1, item2, item3 ]
  put(item4)  -->   WAIT!   Buffer is FULL
                            [ item1, item2, item3 ]    take() --> item1
                            [ item2, item3 ]           Signal: 'space available!'
  put(item4)  -->           [ item2, item3, item4 ]
  (Woken up, continues)
```

**Core Synchronization Rules:**
1. **Producer** must block/wait if the buffer is **full**.
2. **Consumer** must block/wait if the buffer is **empty**.
3. After adding an item, the **Producer** must signal/notify the Consumer.
4. After removing an item, the **Consumer** must signal/notify the Producer.

---

## 2. Approach 1: `synchronized` + `wait()` / `notifyAll()`

This is the traditional, monitor-based approach built into every Java object since JDK 1.0.

### 2.1 Key Methods

| Method | Description |
|---|---|
| `wait()` | Releases the lock and puts the thread to sleep until notified. |
| `notify()` | Wakes up a single arbitrary thread waiting on the object's monitor. |
| `notifyAll()` | Wakes up all threads waiting on the object's monitor (safer; preferred by default). |

> [!danger] CRITICAL
> `wait()`, `notify()`, and `notifyAll()` must only be called from inside a `synchronized` block/method. Otherwise, Java throws `IllegalMonitorStateException`.

> [!warning] Always Use `while`, Never `if`
> ```java
> // ❌ WRONG (spurious wakeup can bypass the check)
> if (buffer.isEmpty()) wait();
> 
> // ✅ CORRECT (thread re-checks the condition after waking up)
> while (buffer.isEmpty()) wait();
> ```
> A thread can wake up **spuriously** (without a signal). Always wrap `wait()` in a `while` loop to recheck the condition.

### 2.2 Complete Implementation

Here is a self-contained, copy-pasteable implementation using lambdas for the threads:

```java
import java.util.LinkedList;
import java.util.Queue;

public class ProducerConsumerWaitNotify {
    private static class SharedBuffer {
        private final Queue<Integer> buffer = new LinkedList<>();
        private final int capacity;

        public SharedBuffer(int capacity) {
            this.capacity = capacity;
        }

        // Called by the Producer thread
        public synchronized void produce(int item) throws InterruptedException {
            // Step 1: Wait if buffer is full (while loop protects against spurious wakeups)
            while (buffer.size() == capacity) {
                System.out.println("[Producer] Buffer FULL. Waiting...");
                wait(); // Releases the monitor lock and sleeps
            }

            // Step 2: Add the item
            buffer.add(item);
            System.out.println("[Producer] Produced: " + item + " | Buffer size: " + buffer.size());

            // Step 3: Wake up waiting threads (Consumers)
            notifyAll();
        }

        // Called by the Consumer thread
        public synchronized int consume() throws InterruptedException {
            // Step 1: Wait if buffer is empty
            while (buffer.isEmpty()) {
                System.out.println("[Consumer] Buffer EMPTY. Waiting...");
                wait(); // Releases the monitor lock and sleeps
            }

            // Step 2: Retrieve the item
            int item = buffer.poll();
            System.out.println("[Consumer] Consumed: " + item + " | Buffer size: " + buffer.size());

            // Step 3: Wake up waiting threads (Producers)
            notifyAll();
            return item;
        }
    }

    public static void main(String[] args) {
        SharedBuffer buffer = new SharedBuffer(3); // Capacity = 3

        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    buffer.produce(i);
                    Thread.sleep(100); // Simulate production speed
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Producer");

        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    buffer.consume();
                    Thread.sleep(200); // Simulate consumer being slower
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Consumer");

        producer.start();
        consumer.start();
    }
}
```

### 2.3 Sample Output

```text
[Producer] Produced: 1 | Buffer size: 1
[Producer] Produced: 2 | Buffer size: 2
[Producer] Produced: 3 | Buffer size: 3
[Producer] Buffer FULL. Waiting...
[Consumer] Consumed: 1 | Buffer size: 2
[Producer] Produced: 4 | Buffer size: 3
[Consumer] Consumed: 2 | Buffer size: 2
...
```

---

## 3. Approach 2: `ReentrantLock` + `Condition` (Modern Way)

Traditional `wait()`/`notifyAll()` uses a single, shared wait set per lock. This means `notifyAll()` wakes *all* waiting threads (both other producers and consumers), which leads to excessive CPU context switching and re-evaluation of loop conditions.

`ReentrantLock` with `Condition` resolves this by allowing **multiple, separate wait sets** on a single lock.

### 3.1 How Condition Works

```java
ReentrantLock lock = new ReentrantLock();

// Separate condition queues
Condition notFull  = lock.newCondition();  // Producers sleep here when full
Condition notEmpty = lock.newCondition();  // Consumers sleep here when empty
```

| `Condition` Method | Equivalent `Object` Method | Meaning |
|---|---|---|
| `condition.await()` | `wait()` | Releases lock and sleeps on this specific condition |
| `condition.signal()` | `notify()` | Wakes up **one** thread waiting on this condition |
| `condition.signalAll()` | `notifyAll()` | Wakes up **all** threads waiting on this condition |

### 3.2 Complete Implementation

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ProducerConsumerCondition {
    private static class SharedBuffer {
        private final Queue<Integer> buffer = new LinkedList<>();
        private final int capacity;

        private final ReentrantLock lock = new ReentrantLock();
        // Two separate condition queues for precise signaling
        private final Condition notFull = lock.newCondition();
        private final Condition notEmpty = lock.newCondition();

        public SharedBuffer(int capacity) {
            this.capacity = capacity;
        }

        public void produce(int item) throws InterruptedException {
            lock.lock(); // Acquire lock explicitly
            try {
                while (buffer.size() == capacity) {
                    System.out.println("[Producer] Buffer FULL. Waiting on notFull...");
                    notFull.await(); // Sleep on notFull condition (releases lock)
                }

                buffer.add(item);
                System.out.println("[Producer] Produced: " + item + " | Size: " + buffer.size());

                // Signal ONLY consumers waiting on notEmpty
                notEmpty.signal();
            } finally {
                lock.unlock(); // Always unlock in finally block
            }
        }

        public int consume() throws InterruptedException {
            lock.lock();
            try {
                while (buffer.isEmpty()) {
                    System.out.println("[Consumer] Buffer EMPTY. Waiting on notEmpty...");
                    notEmpty.await(); // Sleep on notEmpty condition (releases lock)
                }

                int item = buffer.poll();
                System.out.println("[Consumer] Consumed: " + item + " | Size: " + buffer.size());

                // Signal ONLY producers waiting on notFull
                notFull.signal();
                return item;
            } finally {
                lock.unlock();
            }
        }
    }

    public static void main(String[] args) {
        SharedBuffer buffer = new SharedBuffer(3);

        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    buffer.produce(i);
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Producer");

        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    buffer.consume();
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Consumer");

        producer.start();
        consumer.start();
    }
}
```

**Why this is superior:**
* With `wait()`/`notifyAll()`: Waking up 10 threads when only 1 can proceed is wasteful.
* With `Condition`: `notEmpty.signal()` wakes up exactly one sleeping consumer thread, leaving other producers asleep. Zero wasted wakeups.

---

## 4. Approach 3: `BlockingQueue` (Industry Best Practice)

In production, you **almost never** implement manual locking or condition checks. The JDK provides concurrent collections like `BlockingQueue` that encapsulate this complex logic inside clean, thread-safe, and highly optimized methods.

### 4.1 What is BlockingQueue?

* `put(item)`: Blocks the producer thread automatically if the queue is full.
* `take()`: Blocks the consumer thread automatically if the queue is empty.
* All internal lock acquisitions, releases, and signal routines are managed for you.

### 4.2 Common Implementations

| Class | Description |
|---|---|
| `ArrayBlockingQueue` | Bounded queue backed by an array. Most common choice. |
| `LinkedBlockingQueue` | Optionally bounded queue backed by linked nodes (higher throughput). |
| `SynchronousQueue` | Zero-capacity handoff queue. Each put must wait for a take. |
| `PriorityBlockingQueue` | Unbounded queue ordering elements using comparison logic. |

### 4.3 Complete Implementation

Notice how we no longer require a custom `SharedBuffer` class:

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class ProducerConsumerBlockingQueue {
    public static void main(String[] args) {
        // ArrayBlockingQueue handles all locking and conditions internally
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(3);

        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    queue.put(i); // Blocks automatically if the queue is full
                    System.out.println("[Producer] Produced: " + i);
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Producer");

        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    int item = queue.take(); // Blocks automatically if the queue is empty
                    System.out.println("[Consumer] Consumed: " + item);
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }, "Consumer");

        producer.start();
        consumer.start();
    }
}
```

---

## 5. Comparison of the Approaches

| Feature | `synchronized` + `wait`/`notify` | `ReentrantLock` + `Condition` | `BlockingQueue` |
|---|---|---|---|
| **Complexity** | Medium | Medium | Extremely Low |
| **Wakeup Overhead** | High (wakes all threads) | Low (wakes targeted thread group) | Low (optimized internally) |
| **Boilerplate Code** | High | High | Low / None |
| **Timed Wait Support** | `wait(timeout)` | `await(timeout, unit)` | `offer(e, timeout, unit)` / `poll(timeout, unit)` |
| **Bug Likelihood** | High (spurious wakeups, misses) | Medium (forgetting unlock) | Very Low |
| **Recommendation** | Legacy code only | Custom, highly complex flows | Standard production code |

---

## 6. Common Bugs & How to Avoid Them

| Bug | Danger / Why it occurs | Fix |
|---|---|---|
| **Using `if` instead of `while`** | Spurious wakeups cause the thread to proceed while the condition is still false. | Always check the condition inside a `while` loop. |
| **Forgetting to unlock** | If an exception occurs before unlocking, a deadlock happens. | Always release locks in a `finally` block. |
| **Calling outside lock** | JVM throws `IllegalMonitorStateException` or `IllegalMonitorStateException`. | Ensure `wait`/`notify` is within `synchronized`, and `await`/`signal` is inside `lock()`. |
| **`notify()` instead of `notifyAll()`** | Can cause a deadlock if the wrong thread (another producer instead of a consumer) is woken. | Prefer `notifyAll()` for monitor objects. `signal()` is safe with discrete conditions. |
| **Swallowing `InterruptedException`** | Thread loses its cancel/interrupted state. | Always restore the interrupt status with `Thread.currentThread().interrupt()`. |

---

## 7. Cheat Sheet: When to Use What

| Scenario | Recommendation |
|---|---|
| Standard producer-consumer workflow | Use `ArrayBlockingQueue` or `LinkedBlockingQueue` |
| Need a direct handoff from one thread to another | Use `SynchronousQueue` |
| Priority-based task execution (e.g., execution of VIP jobs first) | Use `PriorityBlockingQueue` |
| Highly custom, multi-conditioned state updates | Use `ReentrantLock` + `Condition` |
| Interacting with legacy APIs or old systems | Use `synchronized` + `wait` / `notifyAll` |

---