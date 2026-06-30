
---

# The Fork/Join Framework (Java)

## What is the Fork/Join Framework?

The **Fork/Join Framework** is a Java concurrency framework introduced in **Java 7**.

It is designed to **divide one big task into many small tasks**, execute them **in parallel using multiple CPU cores**, and then **combine the results**.

It is mainly used for **Divide and Conquer** algorithms.

---

## Why do we need Fork/Join?

### Problem

Suppose you have an array containing **100 million numbers**, and you need to calculate the total sum.

### Normal (Single Thread)

```
Thread-1

1 → 2 → 3 → 4 → 5 → …. → 100,000,000
```

Only one CPU core works.

If it takes **20 seconds**, every other CPU core remains idle.

---

### Manual Multithreading

You can create multiple threads manually.

```
Thread-1 -> 1 to 25M
Thread-2 -> 25M to 50M
Thread-3 -> 50M to 75M
Thread-4 -> 75M to 100M
```

But now you must:

- Create threads manually
    
- Divide work correctly
    
- Wait for all threads
    
- Collect partial results
    
- Handle exceptions
    
- Manage synchronization

This becomes difficult for recursive problems.

---

## Solution: Fork/Join Framework

The Fork/Join Framework does this work automatically.

It repeatedly:

1. Breaks a large task into smaller tasks (**Fork**)
    
2. Executes small tasks in parallel
    
3. Combines their results (**Join**)

---

## Meaning of Fork and Join

### Fork

Fork means

> Split one large task into smaller tasks.

Example

```
Array (1 Million Elements)

            Task
              |
      -----------------
      |               |
   Left Task      Right Task
```

Each child task can again be divided.

```
            Task
              |
      -----------------
      |               |
   Left Task      Right Task
      |               |
   --------       --------
   |      |       |      |
 Task  Task     Task   Task
```

This continues until the task becomes small enough.

---

### Join

Join means

> Combine all small task results into one final result.

Example

```
100
+
200
+
150
+
250
--------
700
```

---

# Divide and Conquer

Fork/Join follows the **Divide and Conquer** approach.

```
Large Problem
      |
      v
Split into Smaller Problems
      |
      v
Solve Small Problems
      |
      v
Combine Results
```

---

# Important Classes

## 1. ForkJoinPool

This is the thread pool that executes all Fork/Join tasks.

Instead of creating new threads every time, it reuses worker threads.

Example

```java
ForkJoinPool pool = ForkJoinPool.commonPool();
```

or

```java
ForkJoinPool pool = new ForkJoinPool(4);
```

Here,

```
4 = maximum worker threads
```

---

## 2. RecursiveTask

Use this when the task **returns a value**.

Examples:

- Sum of array
    
- Maximum value
    
- Minimum value
    
- Searching
    
- Counting

Example

```java
class MyTask extends RecursiveTask<Long> {

    @Override
    protected Long compute() {
        return 100L;
    }
}
```

---

## 3. RecursiveAction

Use this when the task **does not return anything**.

Examples

- Sorting
    
- Updating array values
    
- Image processing
    
- Printing

Example

```java
class MyTask extends RecursiveAction {

    @Override
    protected void compute() {

    }
}
```

---

# Internal Working

Suppose we want to calculate the sum of this array.

```
[1….,000,000]
```

Initially

```
Main Task
```

↓

Split

```
0 ----------- 500000

500001 -------1000000
```

↓

Again split

```
0 -----250000

250001-----500000

500001----750000

750001---1000000
```

↓

Again split

Continue until the task size becomes small.

Finally

```
Task1
Task2
Task3
Task4
Task5
Task6
Task7
Task8
```

Each task runs on different worker threads.

---

# Base Case

The task should not be divided forever.

We define a threshold.

Example

```java
private static final int THRESHOLD = 10_000;
```

Meaning

If task size is less than **10,000 elements**, stop splitting.

Instead,

calculate normally using a loop.

---

# Work-Stealing Algorithm

This is the biggest advantage of the Fork/Join Framework.

Every worker thread has its own queue (called a **deque**) of tasks.

Example

```
Worker-1

Task
Task
Task

------------------

Worker-2

Task
Task

------------------

Worker-3

No Task
```

Normally,

Worker-3 would become idle.

Instead,

Worker-3 steals work from another worker.

```
Worker-1

Task
Task

------------------

Worker-3

(Stolen Task)
```

This is called **Work Stealing**.

Benefits:

- Better CPU utilization
    
- Less idle time
    
- Automatic load balancing
    
- Higher performance

---

# Execution Flow

Suppose we have

```
1 Million Numbers
```

Step 1

```
Main Task
```

↓

Step 2

```
Fork

Left

Right
```

↓

Step 3

Worker threads execute

```
Worker-1 -> Left

Worker-2 -> Right
```

↓

Step 4

If still large

```
Fork Again
```

↓

Step 5

Small tasks are calculated normally.

↓

Step 6

Join results.

↓

Final Sum

---

# Complete Example

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ParallelSum extends RecursiveTask<Long> {

    private static final int THRESHOLD = 10_000;

    private final int[] array;
    private final int start;
    private final int end;

    public ParallelSum(int[] array, int start, int end) {
        this.array = array;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {

        // Base case: task is small enough
        if ((end - start) <= THRESHOLD) {

            long sum = 0;

            for (int i = start; i < end; i++) {
                sum += array[i];
            }

            return sum;
        }

        // Divide the task
        int mid = start + (end - start) / 2;

        ParallelSum leftTask = new ParallelSum(array, start, mid);
        ParallelSum rightTask = new ParallelSum(array, mid, end);

        // Execute left task asynchronously
        leftTask.fork();

        // Execute right task in current thread
        long rightResult = rightTask.compute();

        // Wait for left task result
        long leftResult = leftTask.join();

        // Combine results
        return leftResult + rightResult;
    }

    public static void main(String[] args) {

        int[] data = new int[1_000_000];

        for (int i = 0; i < data.length; i++) {
            data[i] = 1;
        }

        ForkJoinPool pool = ForkJoinPool.commonPool();

        long totalSum = pool.invoke(new ParallelSum(data, 0, data.length));

        System.out.println("Total Sum = " + totalSum);
    }
}
```

---

# Step-by-Step Execution of the Code

Suppose the array has **16 elements** and the threshold is **4**.

### Initial Task

```
0 - 16
```

Split into

```
0 - 8

8 - 16
```

Split again

```
0 - 4
4 - 8
8 -12
12-16
```

Each task size is now **4**, which is equal to the threshold.

Each task calculates its sum sequentially.

Example

```
Task1 = 4

Task2 = 4

Task3 = 4

Task4 = 4
```

Join

```
4 + 4 + 4 + 4

=

16
```

Final result is returned to the main thread.

---

# Real-World Uses

The Fork/Join Framework is useful when a large task can be divided into many independent smaller tasks.

Examples:

- Summing large arrays
    
- Parallel merge sort
    
- Parallel quick sort
    
- Image processing (processing different parts of an image simultaneously)
    
- Processing large files
    
- Scientific and mathematical computations
    
- Data analytics on large datasets

---

# Advantages

- Uses multiple CPU cores efficiently
    
- Automatically divides large tasks
    
- Automatically combines results
    
- Supports recursive divide-and-conquer algorithms
    
- Work-stealing keeps CPU cores busy
    
- Better performance for CPU-intensive tasks

---

# Limitations

- Best suited for **CPU-bound** tasks.
    
- Not a good choice for **I/O-bound** tasks (such as database calls, REST API calls, or file/network operations), because worker threads may spend time waiting instead of using the CPU.
    
- Choosing the right **threshold** is important:
    
    - Too small → too many tiny tasks and extra overhead.
        
    - Too large → less parallelism and reduced performance.
        
- Recursive task creation also has some overhead, so very small workloads may run faster with a simple loop.


---


