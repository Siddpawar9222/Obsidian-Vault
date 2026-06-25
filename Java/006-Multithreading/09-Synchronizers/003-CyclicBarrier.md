
---

A **CyclicBarrier** is a synchronization aid that allows a set of threads to **wait for each other at a common barrier point** before continuing execution together.

---

# Why Do We Need CyclicBarrier?

Imagine 4 developers are working on a feature. Each developer writes a different module:
* Authentication
* Payment
* Notification
* Order

Nobody can start integration testing until **all developers finish their module**. 
Therefore, everyone works independently. When one developer finishes early, they must **wait**. Only when the last developer finishes do **all four continue to integration testing together**.

This is exactly what `CyclicBarrier` does.

---

# Real-Life Analogy

### 1. Checkpoint in a Race
Imagine four runners participating in a relay training:
```
Runner 1 ------------\
Runner 2 -------------\
Runner 3 ---------------> Checkpoint (Barrier)
Runner 4 -------------/
```
At the checkpoint:
* Runner 1 arrives first → waits.
* Runner 2 arrives → waits.
* Runner 3 arrives → waits.
* Runner 4 arrives. Now everyone has arrived, the barrier opens, and all four proceed together.

### 2. Road Barrier
```
Car 1  ----|
Car 2  ----| Barrier
Car 3  ----|
```
Cars stop at the barrier. When the last car arrives, the barrier opens, and all cars proceed.

---

# Creating and Using a CyclicBarrier

You initialize a `CyclicBarrier` with the number of threads (parties) that must wait:
```java
CyclicBarrier barrier = new CyclicBarrier(3);
```
Every participating thread calls `barrier.await()` when it reaches the synchronization point:
* Thread-1 calls `await()` → Waiting count = 1. Thread blocks.
* Thread-2 calls `await()` → Waiting count = 2. Thread blocks.
* Thread-3 calls `await()` → Waiting count = 3. Barrier opens. All threads are released.

---

# Visualization

```text
T1 -------- Work ----------|
                            |
T2 ----- Work ------------- | Barrier (await)
                            |
T3 -------- Work ---------- |

All arrived -> Barrier Opens

T1 continues
T2 continues
T3 continues
```

---

# Simple Code Example

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierDemo {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(3);

        Runnable task = () -> {
            try {
                System.out.println(Thread.currentThread().getName() + " is working");
                Thread.sleep((long) (Math.random() * 3000)); // Simulate work
                
                System.out.println(Thread.currentThread().getName() + " reached barrier");
                barrier.await(); // Wait for others
                
                System.out.println(Thread.currentThread().getName() + " crossed barrier");
            } catch (Exception e) {
                e.printStackTrace();
            }
        };

        new Thread(task, "T1").start();
        new Thread(task, "T2").start();
        new Thread(task, "T3").start();
    }
}
```

### Possible Output:
```text
T2 is working
T1 is working
T3 is working
T2 reached barrier
T1 reached barrier
T3 reached barrier
T3 crossed barrier
T2 crossed barrier
T1 crossed barrier
```
*Note: T2 finished first but had to wait for T1 and T3. Only after the last thread (T3) arrived did all threads cross the barrier.*

---

# What is Happening Internally?

When a thread calls `barrier.await()`:
1. The waiting count is incremented.
2. If the count is less than the required barrier size, the thread is parked (`RUNNING` → `WAITING`).
3. When the last thread arrives, the barrier condition is satisfied.
4. The JVM wakes all parked threads (`WAITING` → `RUNNABLE`), and the scheduler executes them.

---

# Why is it called "Cyclic"?

Unlike `CountDownLatch` (which is a one-time gate), a `CyclicBarrier` **can be reused**. After all threads cross the barrier, the barrier automatically resets its counter to 0 for the next cycle.

### Code Demonstrating Reuse (Multi-Phase Workloads)
```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierMultiPhaseDemo {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(3);

        Runnable task = () -> {
            try {
                // Phase 1
                System.out.println(Thread.currentThread().getName() + " Phase 1");
                Thread.sleep((long) (Math.random() * 2000));
                barrier.await(); // Synchronize after Phase 1

                // Phase 2
                System.out.println(Thread.currentThread().getName() + " Phase 2");
                Thread.sleep((long) (Math.random() * 2000));
                barrier.await(); // Synchronize after Phase 2 (Reuse of same barrier)

                System.out.println(Thread.currentThread().getName() + " Finished");
            } catch (Exception e) {
                e.printStackTrace();
            }
        };

        new Thread(task, "T1").start();
        new Thread(task, "T2").start();
        new Thread(task, "T3").start();
    }
}
```

---

# Barrier Action

You can execute a common task **after all threads reach the barrier, but before any proceed**. You do this by providing a `Runnable` action to the constructor:
```java
CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("All workers reached checkpoint. Merging intermediate results...");
});
```
When the last thread calls `await()`:
1. The barrier condition is met.
2. The barrier action runs once on the current thread.
3. All waiting threads are then released.

---

# Industrial Example: Multi-Stage Document Generation

Imagine your LMS project generates a monthly report:
Three independent tasks run in parallel to collect data:
* Student Reports
* Teacher Reports
* Finance Reports

None should write to the final PDF until all sections are ready.
```text
Student --------\
Teacher ---------| Barrier (Merge reports & create PDF via Barrier Action)
Finance --------/
```
Once the PDF is generated, the same threads can proceed to send emails or run post-processing phases. If this report runs monthly, the same `CyclicBarrier` object can coordinate the tasks dynamically without being recreated.

---

# Mental Model

```text
                Checkpoint (Barrier)
                      |
          -------------------------
          |                       |
     T1 arrives              waits
     T2 arrives              waits
     T3 arrives              waits
     T4 arrives        -> Barrier opens (all proceed)

        Phase 2 (Resets automatically)

     T1 arrives              waits
     T2 arrives              waits
     T3 arrives              waits
     T4 arrives        -> Barrier opens again
```
**CyclicBarrier = "A reusable meeting point where a fixed group of threads waits for each other before moving forward together."**
