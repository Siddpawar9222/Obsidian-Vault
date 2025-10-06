

---

## 🔹 Using `BlockingQueue` (Recommended)

Java provides **`java.util.concurrent.BlockingQueue`**, which **handles all the waiting and notifying internally**.

- Producer **puts** items into the queue.
    
    - If the queue is full → automatically waits.
        
- Consumer **takes** items from the queue.
    
    - If the queue is empty → automatically waits.
        

No need for `synchronized`, `wait()`, or `notify()` manually.

---

### 🔹 Example: Producer-Consumer with `ArrayBlockingQueue`

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class ProducerConsumerExample {
    public static void main(String[] args) {
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5); // capacity 5

        // Producer thread
        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    queue.put(i); // waits if queue is full
                    System.out.println("Produced: " + i);
                    Thread.sleep(200); // simulate production time
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        // Consumer thread
        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try {
                    int item = queue.take(); // waits if queue is empty
                    System.out.println("Consumed: " + item);
                    Thread.sleep(400); // simulate consumption time
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        producer.start();
        consumer.start();
    }
}
```

**Output (sample):**

```
Produced: 1
Consumed: 1
Produced: 2
Produced: 3
Consumed: 2
Produced: 4
Consumed: 3
...
```

---

### 🔹 Why this is better than `wait/notify`

1. **No low-level synchronization needed**
    
    - `BlockingQueue` handles thread-safety internally.
        
2. **Automatic blocking**
    
    - `put()` blocks if the queue is full.
        
    - `take()` blocks if the queue is empty.
        
3. **Less error-prone**
    
    - No missed notifications, no `IllegalMonitorStateException`.
        
4. **Works with thread pools easily**
    
    - You can submit multiple producers and consumers to an `ExecutorService`.
        

---

### 🔹 Using Multiple Producers and Consumers with ExecutorService

```java
import java.util.concurrent.*;

public class ProducerConsumerExecutor {
    public static void main(String[] args) {
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);
        ExecutorService executor = Executors.newFixedThreadPool(4);

        // 2 Producers
        for (int i = 0; i < 2; i++) {
            int producerId = i + 1;
            executor.submit(() -> {
                for (int j = 1; j <= 5; j++) {
                    try {
                        queue.put(j + (producerId - 1) * 5);
                        System.out.println("Producer " + producerId + " produced: " + (j + (producerId - 1) * 5));
                    } catch (InterruptedException e) { e.printStackTrace(); }
                }
            });
        }

        // 2 Consumers
        for (int i = 0; i < 2; i++) {
            int consumerId = i + 1;
            executor.submit(() -> {
                for (int j = 1; j <= 5; j++) {
                    try {
                        int item = queue.take();
                        System.out.println("Consumer " + consumerId + " consumed: " + item);
                    } catch (InterruptedException e) { e.printStackTrace(); }
                }
            });
        }

        executor.shutdown();
    }
}
```

- Cleaner, scalable, works for **any number of producers/consumers**.
    
- No manual `wait/notify` mistakes.
    

---

💡 **Key takeaway:**

- Use `BlockingQueue` (`ArrayBlockingQueue`, `LinkedBlockingQueue`, etc.) to solve Producer-Consumer **safely and elegantly**.
    
- Can easily integrate with **ExecutorService** for multiple producers and consumers.
    

---

If you want, I can also show **how to implement Producer-Consumer using `Semaphore`**, which is another concurrency approach commonly asked in interviews.

