
---

**Parallel Streams** allow us to process data **faster** by splitting a stream into **multiple parts** and running them in **parallel** using multiple CPU cores.

### **1. What are Parallel Streams?**

A **parallel stream** is a stream that divides elements into **multiple substreams** and processes them **simultaneously** using multiple threads.

- A **sequential stream** processes elements **one by one**.
- A **parallel stream** processes elements **at the same time** using **multiple CPU cores**.

#### **Example:**

Let’s say you have **100 orders** in an e-commerce application.

- A **sequential stream** will process **one order at a time**.
- A **parallel stream** will process **multiple orders at the same time** using multiple threads.

---

### **2. When to Use Parallel Streams?**

You should use **parallel streams** when: ✅ You have **a large dataset** (e.g., processing millions of records).  
✅ The operations on elements are **independent** (not dependent on previous elements).  
✅ The operations are **CPU-intensive** (e.g., mathematical calculations, data processing).

**Do NOT use parallel streams when:** ❌ The tasks are **small or simple** (parallelism overhead can slow it down).  
❌ The tasks involve **I/O operations** (like reading/writing files or databases).  
❌ The data structure is **shared and modified by multiple threads** (risk of inconsistency).

---

### **3. Performance Considerations**

- **Parallel streams use multiple threads**, so they can improve performance **only if there are multiple CPU cores available**.
- **Not always faster**: If there is **too much thread switching**, performance might be **worse** than a sequential stream.
- **Best suited for large data**: For **small datasets, sequential streams are usually better**.

---

### **4. Converting Sequential Stream to Parallel Stream**

You can convert a **sequential stream** to a **parallel stream** using:

- `parallel()` → Converts an **existing stream** into a **parallel stream**.
- `parallelStream()` → Creates a **parallel stream** directly from a collection.

---


### **💡 Industrial Use Case Example**

🏢 **Company:** Amazon  
📦 **Scenario:** Processing millions of orders

- **Sequential processing** → Takes **too much time**.
- **Parallel processing** → Orders are processed **faster using multiple CPU cores**.
- **Example Code:**

```java
orders.parallelStream().forEach(order -> processOrder(order));
```

🔹 This will **process multiple orders in parallel**, improving efficiency.


---

### **How Parallel Streams Work Internally?**

When you use a **parallel stream**, Java **does not create a new thread for each element** (that would be inefficient). Instead, it uses a **common thread pool** called **ForkJoinPool**.

---

### **1. What is ForkJoinPool?**

- **ForkJoinPool** is a special type of thread pool in Java designed for **parallelism**.
- It **splits a large task into smaller tasks**, executes them **in parallel**, and then **combines the results** (this is called **fork/join** processing).

---

### **2. How Parallel Streams Use ForkJoinPool?**

- When you call `.parallelStream()`, it submits tasks to the **common ForkJoinPool**.
- The **default number of threads** is equal to **CPU cores** (e.g., on a 4-core system, ForkJoinPool has 4 worker threads).
- It **divides the data** into chunks and assigns them to worker threads.
- The **results are combined** once all tasks are completed.

---

### **3. Example: Checking the Default ForkJoinPool Size**

```java
import java.util.concurrent.ForkJoinPool;

public class ForkJoinPoolExample {
    public static void main(String[] args) {
        // Get the number of threads in the common ForkJoinPool
        int poolSize = ForkJoinPool.commonPool().getParallelism();
        System.out.println("Default ForkJoinPool Parallelism: " + poolSize);
    }
}
```

🔹 **On a 4-core CPU, output might be:**

```
Default ForkJoinPool Parallelism: 3
```

💡 **By default, ForkJoinPool uses (CPU cores - 1) threads** for parallel execution.

---

### **4. Can We Increase Parallelism?**

Yes! You can **increase the number of threads** in the ForkJoinPool.

```java
System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism", "8");
```

But be careful—**too many threads can cause overhead instead of improving performance**. It’s usually best to keep it equal to or slightly below the number of CPU cores.

---

### **5. Example: Custom ForkJoinPool**

If you want **full control** over parallel execution, you can create a **custom ForkJoinPool** instead of using the default one.

```java
import java.util.concurrent.ForkJoinPool;
import java.util.stream.IntStream;

public class CustomForkJoinPoolExample {
    public static void main(String[] args) {
        ForkJoinPool customPool = new ForkJoinPool(8); // Using 8 threads

        customPool.submit(() -> {
            long sum = IntStream.range(1, 1_000_000)
                                .parallel()
                                .sum();
            System.out.println("Sum: " + sum);
        }).join();

        customPool.shutdown();
    }
}
```

💡 **Here, we manually create an 8-thread ForkJoinPool instead of using the default.**

---

### **6. Summary**

✅ **Parallel streams** use **ForkJoinPool** internally for **multi-threading**.  
✅ The default thread count is **(CPU cores - 1)**, but it can be **modified**.  
✅ **ForkJoinPool splits tasks** into smaller ones and processes them **in parallel**.  
✅ **Use parallelism wisely**—too many threads can slow things down!

---
