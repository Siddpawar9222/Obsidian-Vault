
---

## 1. The Memory Visibility Problem

### 1.1 Why Memory Visibility Bugs Happen
In modern computers, CPUs have multiple cores, and each core has its own ultra-fast **CPU cache**.
* When a thread reads a variable, it often copies it from the main computer memory into its CPU cache.
* If **Thread A** updates a variable, it might update its local CPU cache first.
* If **Thread B** reads the same variable from a different core, it might read its own stale CPU cache, remaining unaware of Thread A's update.

```text
Thread A (Core 1) writes status = "COMPLETED" (in Core 1 Cache)
Thread B (Core 2) reads status               -> "PENDING" (from Core 2 Cache/Main Memory)
```

> ![[jmm_cpu_cache_visibility.svg|700x400]]

### 1.2 The `volatile` Keyword
Declaring a variable as `volatile` forces Java to read and write the variable **directly from/to main memory**, bypassing CPU caches. All threads will see the most up-to-date value immediately.

```java
public class VisibilityDemo {
    private static volatile boolean keepRunning = true; // volatile ensures visibility

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (keepRunning) {
                // If keepRunning was not volatile, this thread might cache it as true
                // and loop forever, even after the main thread sets it to false.
            }
            System.out.println("Worker thread stopped!");
        });

        worker.start();
        Thread.sleep(1000);
        
        System.out.println("Main thread request stop...");
        keepRunning = false; // Writes directly to main memory
    }
}
```

> [!important] IMPORTANT LIMITATION
> `volatile` only solves **visibility** (ensuring threads see changes). It **does not** solve race conditions (atomicity).
> For compound operations like `count++` (which is actually: read -> increment -> write), `volatile` is not enough. You must use `synchronized` or atomic classes (e.g., `AtomicInteger`).

---

## 2. Cheatsheet & Summary

| Concept | What it is | Symptom of Failure | Solution |
|---|---|---|---|
| **Memory Visibility** | Core cache storing outdated local copies of variables. | Infinite loops, threads reading old values. | `volatile` or `synchronized`. |
| **Intrinsic Lock** | The implicit lock attached to every Java object. | Threads overwriting each other's progress. | Acquired via `synchronized`. |

---

