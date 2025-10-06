

---

### 🔹 First, recap how thread pools generally work:

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
                60, TimeUnit.SECONDS,   // keepAliveTime for extra threads
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
    
    - In this example, `CallerRunsPolicy` makes the **main thread execute** them.
        


---

