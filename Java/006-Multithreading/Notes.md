# CPU Core, Thread, Multithreading, Concurrency & Parallelism


## What is a CPU Core?

A CPU core is the actual execution unit inside the processor.

Think of a core as a worker.

```text
1 Core  = 1 Worker
2 Cores = 2 Workers
4 Cores = 4 Workers
```

A core executes machine instructions.

---

## What is a Process?

A process is a running program.

Examples:

```text
Chrome
IntelliJ IDEA
Docker
Spotify
```

Each running application is a process.

---

## What is a Thread?

A thread is the smallest unit of execution inside a process.

Think:

```text
Process = Company
Thread  = Employee
```

Example:

```text
IntelliJ Process
│
├── UI Thread
├── Compiler Thread
├── Git Thread
└── Indexing Thread
```

Each thread performs a different task.

---

## What is Multithreading?

Multithreading means:

> A process contains multiple threads that can perform multiple tasks.

Example:

```text
IntelliJ
│
├── UI Thread
├── Compiler Thread
├── Git Thread
└── Indexing Thread
```

This is a multithreaded application.

### Important

Multithreading only means:

```text
Multiple Threads Exist
```

It does NOT automatically mean:

```text
Parallelism
```

---

# What does "Executing" mean?

Executing means:

> A CPU core is currently running instructions of a thread.

Example:

```text
Core 1 → Thread A
```

At this moment:

```text
Thread A = Executing
Thread B = Waiting
```

---

# What does "Making Progress" mean?

Making progress means:

> A task gets CPU time periodically and moves closer to completion.

Example:

```text
Time 1 → Thread A
Time 2 → Thread B
Time 3 → Thread A
Time 4 → Thread B
```

Both threads are moving forward.

Both are making progress.

---

# What is Concurrency?

Concurrency means:

> Multiple tasks make progress during the same time period.

The tasks do NOT need to execute at the exact same instant.


**Analogy**:  
1 cook, 2 dishes → the cook cuts vegetables for dish 1, then stirs dish 2, then goes back to dish 1… both dishes progress, but not exactly at the same instant.


Example:

```text
Thread A
Thread B
```

CPU:

```text
A → B → A → B → A
```

Both tasks are progressing.

This is concurrency.

---

## Concurrency on a Single Core

Suppose:

```text
1 Core

Thread A
Thread B
```

Execution:

```text
A → B → A → B → A
```

Only one thread executes at a time.

But both tasks make progress.

Result:

```text
Concurrency = YES
Parallelism = NO
```

---

# What is Parallelism?

Parallelism means:

> Multiple tasks execute at the exact same moment.

For this we need multiple cores.

**Analogy**:  
2 cooks, 2 dishes → both dishes are cooked **at the same time**.

Example:

```text
Core 1 → Thread A
Core 2 → Thread B
```

At the same instant:

```text
Thread A running
Thread B running
```

This is parallelism.

---

## Parallelism on Multiple Cores

Example:

```text
Core 1 → Thread A
Core 2 → Thread B
```

Result:

```text
Concurrency = YES
Parallelism = YES
```

Why concurrency?

Because both tasks are making progress.

Why parallelism?

Because both tasks are executing simultaneously.

---

# Most Common Confusion

Many people think:

```text
Concurrency = Single Core
Parallelism = Multiple Core
```

This is not fully correct.

Correct understanding:

```text
Single Core
    └── Concurrency

Multiple Cores
    ├── Concurrency
    └── Parallelism
```

Concurrency can exist on both single-core and multi-core systems.

Parallelism requires multiple cores.

---

# Relationship Between Multithreading, Concurrency and Parallelism

```text
Multithreading
      │
      ▼
Multiple Threads Exist
      │
      ▼
Concurrency
(Multiple Tasks Progress)
      │
      ▼
Parallelism
(Multiple Tasks Execute Simultaneously)
```

---

# Real Example: Your Ryzen 3 3250U

Your CPU:

```text
2 Physical Cores
4 Logical Threads (SMT)
```

Applications:

```text
Chrome
IntelliJ
Docker
Spotify
```

Each application contains multiple threads.

Example:

```text
IntelliJ
│
├── UI Thread
├── Compiler Thread
├── Git Thread
└── Indexing Thread
```

OS Scheduler decides:

```text
Core 1 → UI Thread
Core 2 → Compiler Thread
```

Later:

```text
Core 1 → Git Thread
Core 2 → Indexing Thread
```

Result:

```text
Multiple threads exist      → Multithreading
Tasks keep progressing      → Concurrency
Some run simultaneously     → Parallelism
```

---

# Java Example

```java
ExecutorService executor =
        Executors.newFixedThreadPool(2);

executor.submit(taskA);
executor.submit(taskB);
```

### On 1 Core

```text
A → B → A → B
```

Result:

```text
Multithreading = YES
Concurrency    = YES
Parallelism    = NO
```

### On 2 Cores

```text
Core 1 → A
Core 2 → B
```

Result:

```text
Multithreading = YES
Concurrency    = YES
Parallelism    = YES
```

---

# Interview Definitions

### Thread

> Smallest unit of execution inside a process.

### Multithreading

> Having multiple threads inside a process.

### Concurrency

> Multiple tasks making progress during the same period of time.

### Parallelism

> Multiple tasks executing simultaneously.

---

# Important 

```text
Multithreading = Multiple threads exist.

Concurrency = Multiple tasks make progress.

Parallelism = Multiple tasks execute at the same time.
```

Important rule:

```text
Every Parallel Program is Concurrent.

But every Concurrent Program is NOT Parallel.
```

---


