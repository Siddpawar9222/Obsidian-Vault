# Conditions & Producer-Consumer

---

## 2. The Producer-Consumer Problem

This is the most classic problem in concurrency. Understand this and you understand conditions completely.

### 2.1 What is the Problem?

Two types of threads share a common buffer (queue):

| Thread | What it does | Problem when... |
|---|---|---|
| Producer | Creates items and puts them in the buffer | Buffer is **FULL** — cannot add more |
| Consumer | Takes items from the buffer and processes them | Buffer is **EMPTY** — nothing to take |

### 2.2 The Flow

```
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

**Key Rules:**
1. Producer must WAIT if buffer is FULL
2. Consumer must WAIT if buffer is EMPTY
3. After adding an item, Producer must SIGNAL the Consumer
4. After removing an item, Consumer must SIGNAL the Producer

---

## 3. Approach 1 — `synchronized + wait() / notify()`

This is the **oldest approach** in Java. Every object has a built-in monitor lock. You can call `wait()` to release the lock and sleep, and `notify()` to wake another sleeping thread.

### 3.1 Key Methods

| Method | What it does |
|---|---|
| `wait()` | Releases the lock and puts current thread to sleep. Thread waits until `notify()` is called. |
| `notify()` | Wakes up ONE random thread that is waiting on this object's monitor. |
| `notifyAll()` | Wakes up ALL threads waiting on this object. Safer — use this by default. |

> **CRITICAL:** `wait()`, `notify()`, `notifyAll()` MUST be called inside a `synchronized` block. If not, Java throws `IllegalMonitorStateException`.

> **CRITICAL — Always use `while`, never `if`:**
> ```java
> // WRONG
> if (buffer.isEmpty()) wait();
>
> // CORRECT
> while (buffer.isEmpty()) wait();
> ```
> A thread can wake up **spuriously** (without being notified) due to OS behavior. With `if`, it may proceed even when the condition is still false. With `while`, it re-checks after waking up. Always safe.

### 3.2 Full Code

```java
import java.util.LinkedList;
import java.util.Queue;

// SharedBuffer.java
// This is the shared resource between Producer and Consumer.
// Think of it as the kitchen counter in a restaurant.
public class SharedBuffer {

    private final Queue<Integer> buffer = new LinkedList<>();
    // buffer holds the items. LinkedList works as a FIFO queue.

    private final int capacity;
    // Maximum number of items buffer can hold at one time.

    public SharedBuffer(int capacity) {
        this.capacity = capacity;
    }

    // Called by the Producer thread
    public synchronized void produce(int item) throws InterruptedException {

        // Step 1: If buffer is full, wait.
        // Use 'while' NOT 'if' — protects against spurious wakeups.
        while (buffer.size() == capacity) {
            System.out.println("[Producer] Buffer FULL. Waiting...");
            wait(); // Releases the lock and sleeps
        }

        // Step 2: Buffer has space. Add the item.
        buffer.add(item);
        System.out.println("[Producer] Produced: " + item + " | Buffer size: " + buffer.size());

        // Step 3: Notify Consumer that new item is available.
        notifyAll(); // Wake up all waiting threads (Consumer in this case)
    }

    // Called by the Consumer thread
    public synchronized int consume() throws InterruptedException {

        // Step 1: If buffer is empty, wait.
        while (buffer.isEmpty()) {
            System.out.println("[Consumer] Buffer EMPTY. Waiting...");
            wait(); // Releases the lock and sleeps
        }

        // Step 2: Buffer has items. Remove the oldest item (FIFO).
        int item = buffer.poll();
        System.out.println("[Consumer] Consumed: " + item + " | Buffer size: " + buffer.size());

        // Step 3: Notify Producer that space is available.
        notifyAll(); // Wake up all waiting threads (Producer in this case)

        return item;
    }
}
```

```java
// Producer.java
// Produces items 1 to 10 and puts them in the shared buffer.
public class Producer implements Runnable {

    private final SharedBuffer buffer;

    public Producer(SharedBuffer buffer) {
        this.buffer = buffer;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            try {
                buffer.produce(i);        // Try to add item to buffer
                Thread.sleep(100);         // Simulate some work/delay
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // Best practice: restore interrupt flag
            }
        }
    }
}
```

```java
// Consumer.java
// Consumes 10 items from the shared buffer.
public class Consumer implements Runnable {

    private final SharedBuffer buffer;

    public Consumer(SharedBuffer buffer) {
        this.buffer = buffer;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                int item = buffer.consume();  // Try to take item from buffer
                Thread.sleep(200);             // Consumer is slower than producer
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
```

```java
// Main.java — Entry point
public class Main {
    public static void main(String[] args) {

        SharedBuffer buffer = new SharedBuffer(3); // Max 3 items

        Thread producerThread = new Thread(new Producer(buffer), "Producer");
        Thread consumerThread = new Thread(new Consumer(buffer), "Consumer");

        producerThread.start(); // Producer starts adding items
        consumerThread.start(); // Consumer starts taking items
    }
}
```

### 3.3 Sample Output

```
[Producer] Produced: 1 | Buffer size: 1
[Producer] Produced: 2 | Buffer size: 2
[Producer] Produced: 3 | Buffer size: 3
[Producer] Buffer FULL. Waiting...
[Consumer] Consumed: 1 | Buffer size: 2
[Producer] Produced: 4 | Buffer size: 3
[Consumer] Consumed: 2 | Buffer size: 2
...
```

What happened step by step:
1. Producer fills buffer to max (3)
2. Producer hits `wait()` — releases lock and sleeps
3. Consumer takes an item — calls `notifyAll()` — Producer wakes up
4. Producer adds next item — calls `notifyAll()` — Consumer wakes up
5. This dance continues until all 10 items are processed

---

## 4. Approach 2 — `ReentrantLock + Condition` (Modern Way)

With `synchronized + wait/notify`, you have **ONE wait set** for the lock. So when you call `notifyAll()`, it wakes ALL threads — including those waiting for a different condition. This is wasteful.

`ReentrantLock + Condition` gives you **separate wait sets** for different conditions. You can wake ONLY producers or ONLY consumers. Much more precise.

### 4.1 How Condition Works

```java
ReentrantLock lock = new ReentrantLock();

// Two separate condition queues
Condition notFull  = lock.newCondition(); // Producer waits here when buffer is full
Condition notEmpty = lock.newCondition(); // Consumer waits here when buffer is empty
```

| Method | Equivalent to | Meaning |
|---|---|---|
| `condition.await()` | `wait()` | Release lock, sleep on this condition |
| `condition.signal()` | `notify()` | Wake ONE thread waiting on this condition |
| `condition.signalAll()` | `notifyAll()` | Wake ALL threads waiting on this condition |

### 4.2 Full Code

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

// SharedBufferWithCondition.java
public class SharedBufferWithCondition {

    private final Queue<Integer> buffer = new LinkedList<>();
    private final int capacity;

    // One lock controls access to the buffer
    private final ReentrantLock lock = new ReentrantLock();

    // Two separate condition queues — very precise signaling
    private final Condition notFull  = lock.newCondition(); // Producer sleeps here
    private final Condition notEmpty = lock.newCondition(); // Consumer sleeps here

    public SharedBufferWithCondition(int capacity) {
        this.capacity = capacity;
    }

    // Called by Producer thread
    public void produce(int item) throws InterruptedException {
        lock.lock();      // Acquire the lock
        try {
            // Wait until there is space in the buffer
            while (buffer.size() == capacity) {
                System.out.println("[Producer] Buffer FULL. Waiting on notFull...");
                notFull.await(); // Sleep on notFull condition (releases lock)
            }

            // Space is available — add the item
            buffer.add(item);
            System.out.println("[Producer] Produced: " + item + " | Size: " + buffer.size());

            // Signal ONLY the consumer — no need to wake up other producers
            notEmpty.signal(); // 'Buffer is not empty anymore — Consumer can proceed'

        } finally {
            lock.unlock(); // ALWAYS unlock in finally block
        }
    }

    // Called by Consumer thread
    public int consume() throws InterruptedException {
        lock.lock();
        try {
            // Wait until there is at least one item
            while (buffer.isEmpty()) {
                System.out.println("[Consumer] Buffer EMPTY. Waiting on notEmpty...");
                notEmpty.await(); // Sleep on notEmpty condition (releases lock)
            }

            // Item available — remove it
            int item = buffer.poll();
            System.out.println("[Consumer] Consumed: " + item + " | Size: " + buffer.size());

            // Signal ONLY the producer — buffer now has space
            notFull.signal(); // 'Buffer is not full anymore — Producer can proceed'

            return item;

        } finally {
            lock.unlock();
        }
    }
}
```

**Why this is better than `wait/notifyAll`:**

With `wait/notifyAll`: If you have 5 producers and 5 consumers all waiting, `notifyAll()` wakes up ALL 10 threads. 9 of them re-check and go back to sleep. Wasteful.

With `Condition`: `notEmpty.signal()` wakes ONLY one sleeping consumer. `notFull.signal()` wakes ONLY one sleeping producer. Zero waste.

---

## 5. Approach 3 — `BlockingQueue` (Industry Best Practice)

In real production code, you **almost never** write the wait/notify or Condition logic yourself. Java provides `BlockingQueue` — it handles ALL of this internally.

### 5.1 What is BlockingQueue?

- `put(item)` — blocks if queue is full (same as our produce + wait logic)
- `take()` — blocks if queue is empty (same as our consume + wait logic)
- All internal locking and signaling is handled for you
- Thread-safe by design

### 5.2 Common Implementations

| Class | Use when... |
|---|---|
| `ArrayBlockingQueue` | You need a fixed-size, bounded buffer. Most common choice. |
| `LinkedBlockingQueue` | You want optionally bounded queue with high throughput. |
| `SynchronousQueue` | No internal buffer. Producer directly hands off to Consumer. |
| `PriorityBlockingQueue` | Items should be processed in priority order, not FIFO. |

### 5.3 Full Code

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

// ProducerTask.java
public class ProducerTask implements Runnable {

    private final BlockingQueue<Integer> queue;

    public ProducerTask(BlockingQueue<Integer> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 10; i++) {
            try {
                queue.put(i);  // Blocks automatically if queue is full. No extra code needed!
                System.out.println("[Producer] Produced: " + i);
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}

// ConsumerTask.java
public class ConsumerTask implements Runnable {

    private final BlockingQueue<Integer> queue;

    public ConsumerTask(BlockingQueue<Integer> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                int item = queue.take(); // Blocks automatically if queue is empty. No extra code needed!
                System.out.println("[Consumer] Consumed: " + item);
                Thread.sleep(200);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}

// Main.java
public class Main {
    public static void main(String[] args) {
        // ArrayBlockingQueue with capacity 3
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(3);

        new Thread(new ProducerTask(queue), "Producer").start();
        new Thread(new ConsumerTask(queue), "Consumer").start();
    }
}
```

> The entire `SharedBuffer` class with 30+ lines of locking code is gone. `BlockingQueue` replaces it with just `queue.put()` and `queue.take()`. This is why production code uses `BlockingQueue`.

---

## 6. Comparison of All Three Approaches

| Feature | synchronized + wait/notify | ReentrantLock + Condition | BlockingQueue |
|---|---|---|---|
| Ease of use | Medium | Medium | Very Easy |
| Precision of wakeup | Low (wakes all) | High (separate queues) | High (internal) |
| Code you write | Most code | Moderate code | Almost none |
| Timed wait support | `wait(timeout)` | `await(time, unit)` | `poll(time, unit)` |
| When to use | Legacy code only | Custom complex flows | Production — always |
| Risk of bugs | High (spurious wake) | Low (while + await) | Very Low |

---

## 7. Common Bugs and How to Avoid Them

| Bug | Why it happens | Fix |
|---|---|---|
| Using `if` instead of `while` | Thread wakes up but condition may still be false (spurious wakeup) | Always use `while` loop around `wait`/`await` |
| Forgetting to unlock in `finally` | If exception occurs, lock is never released — deadlock! | Always use `try { ... } finally { lock.unlock(); }` |
| Calling `wait()` outside `synchronized` | Throws `IllegalMonitorStateException` | Always call inside `synchronized` block |
| `notify()` instead of `notifyAll()` | Only one thread wakes — wrong one may wake up | Use `notifyAll()` with wait/notify; `signal()` is fine with Condition |
| Not handling `InterruptedException` | Thread silently swallows interrupt, may hang forever | Always restore interrupt flag: `Thread.currentThread().interrupt()` |

---

## 10. Cheat Sheet — When to Use What

| Situation | Use This |
|---|---|
| Simple bounded buffer, production code | `BlockingQueue` (`ArrayBlockingQueue`) |
| Need separate wakeup queues for producers/consumers | `ReentrantLock + Condition` |
| Working with legacy/old Java code | `synchronized + wait/notifyAll` |
| Producer directly hands off to single consumer | `SynchronousQueue` |
| Priority-based processing (e.g., VIP tickets first) | `PriorityBlockingQueue` |
| Background task queue in Spring Boot | `BlockingQueue` + `@PostConstruct` worker thread |

---

*Java Concurrency Series — Conditions & Producer-Consumer | Siddhesh's Notes*