

---


### 🔹How thread pools  works:

A **ThreadPoolExecutor** has these main parts:

- **Core Pool Size** → minimum number of threads always kept alive.
    
- **Maximum Pool Size** → maximum number of threads allowed.
    
- **Work Queue** → tasks waiting to be executed.
    
- **RejectedExecutionHandler** → what to do if queue is full and no new thread can be created.
    

---

### 🔹 Rule of how tasks are executed:

When you submit a task to `ThreadPoolExecutor`:

1. If **current thread count < corePoolSize** → create a new thread and execute task.
    
2. Else if **core threads are busy** → put task into **queue**.
    
3. If **queue is full** and **current thread count < maximumPoolSize** → create an extra thread.
    
4. If **queue is full** and **threads == maximumPoolSize** → reject task (goes to RejectedExecutionHandler).

---

### 🔹 Example: Custom ExecutorService

```java
import java.util.concurrent.*;

public class CustomExecutorExample {
    public static void main(String[] args) {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                2,                      // corePoolSize
                4,                      // maximumPoolSize
                60,                     // keepAliveTime for extra threads
                TimeUnit.SECONDS, 
                new ArrayBlockingQueue<>(2),  // queue with size 2
                new ThreadPoolExecutor.CallerRunsPolicy() // rejection handler
        );

        // Submit 8 tasks
        for (int i = 1; i <= 8; i++) {
            final int taskId = i;
            executor.submit(() -> {
                System.out.println("Task " + taskId + " executed by " + Thread.currentThread().getName());
                try {
                    Thread.sleep(2000); // simulate work
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }

        executor.shutdown();
    }
}
```

---

### 🔹 How this behaves:

- **Core pool size = 2** → 2 threads created immediately.
    
- **Queue size = 2** → next 2 tasks will be queued.
    
- Now 4 tasks are already accepted.
    
- **Next tasks (5 & 6)** → since queue is full and thread count < max (4), 2 more threads are created.
    
- **Tasks 7 & 8** → now queue is full + max threads (4) reached → rejection handler is triggered.


---

# Important Questions : 

## Does `corePoolSize` create threads immediately?

Example:

```java
new ThreadPoolExecutor(
        2, 4, 60,
        TimeUnit.SECONDS,
        new ArrayBlockingQueue<>(2)
);
```

### Answer

❌ No.

When the pool is created:

```text
ThreadPool Created
|
└── 0 Threads
```

No worker threads are created initially.

Threads are created only when tasks are submitted.

---

### If only one task is submitted

```java
executor.submit(task1);
```

Result:

```text
Worker-1 created
```

Only one thread exists.

`Worker-2` is not created because there is no need.

---

### Meaning of `corePoolSize = 2`

It means:

```text
Up to 2 threads can be created before using the queue.
```

It does NOT mean:

```text
Always create 2 threads immediately.
```

---

## What happens when no tasks are left?

Suppose:

```text
Worker-1 (core)
Worker-2 (core)
Worker-3 (extra)
Worker-4 (extra)
```

All tasks finish.

---

### Core Threads

By default:

```java
allowCoreThreadTimeOut(false);
```

Core threads remain alive.

```text
Worker-1 stays alive
Worker-2 stays alive
```

They wait for future tasks.

---

### Extra Threads

Threads above core size:

```text
Worker-3
Worker-4
```

use:

```java
keepAliveTime = 60 seconds
```

If idle for 60 seconds:

```text
Worker-3 dies
Worker-4 dies
```

Pool shrinks back to:

```text
Worker-1
Worker-2
```

---

## What if I want core threads to die too?

```java
executor.allowCoreThreadTimeOut(true);
```

Now if all threads stay idle for 60 seconds:

```text
Worker-1 dies
Worker-2 dies
Worker-3 dies
Worker-4 dies
```

Pool becomes:

```text
0 Threads
```

---

## What happens after `shutdown()`?

```java
executor.shutdown();
```

Result:

```text
No new tasks accepted.
Existing tasks complete.
All worker threads terminate.
```

Final state:

```text
0 Threads
```

---

## Quick Revision

```text
Pool Creation
    ↓
0 Threads Created

First Task Arrives
    ↓
Create Thread

Only 1 Task Submitted
    ↓
Only 1 Thread Created

No Tasks Left
    ↓
Core Threads Stay Alive
Extra Threads Die After keepAliveTime

allowCoreThreadTimeOut(true)
    ↓
Even Core Threads Die

shutdown()
    ↓
All Threads Die After Completing Work
```