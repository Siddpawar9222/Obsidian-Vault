
---

## 📂 01. Foundation (Start Here)

These are the absolute basics.

```
01-Foundation
│
├── What is Process?
├── What is Thread?
├── Process vs Thread
├── Concurrency vs Parallelism
├── CPU Core vs Processor
├── Context Switching
├── Thread Lifecycle
├── Main Thread
├── User Thread
├── Daemon Thread
├── Creating Threads
├── Runnable vs Thread
└── Thread Scheduling
```

---

## 📂 02. Thread Communication

```
02-Thread-Basics

├── sleep()
├── yield()
├── join()
├── interrupt()
├── wait()
├── notify()
├── notifyAll()
└── Producer Consumer Problem
```

---

## 📂 03. Synchronization Basics

First time learning how threads protect shared data.

```
03-Synchronization

├── Race Condition
├── Critical Section
├── synchronized Keyword
├── Object Monitor
├── Monitor Lock
├── Intrinsic Lock
├── Reentrant Synchronization
└── Deadlock
```

---

## 📂 04. Java Memory Model (Very Important)

Many interview questions come from here.

```
04-Java-Memory-Model

├── Heap Memory
├── Stack Memory
├── Thread Stack
├── Working Memory
├── Main Memory
├── Visibility Problem
├── Atomicity
├── Ordering
├── Happens-Before
├── Instruction Reordering
├── volatile Keyword
└── Final Keyword
```

---

## 📂 05. Explicit Locks

Everything in `java.util.concurrent.locks`

```
05-Locks

├── Why ReentrantLock?
├── Lock Interface
├── ReentrantLock
├── Fair Lock
├── Non-Fair Lock
├── tryLock()
├── lockInterruptibly()
├── Conditions
├── ReadWriteLock
├── StampedLock
│      ├── Optimistic Read
│      ├── Pessimistic Read
│      ├── Write Lock
│      ├── Upgrade
│      └── Downgrade
```

---

## 📂 06. Atomic Variables & CAS

This deserves its own folder.

```
06-Atomic

├── AtomicInteger
├── AtomicLong
├── AtomicBoolean
├── AtomicReference
├── AtomicStampedReference
├── AtomicMarkableReference
├── CAS
├── ABA Problem
├── CPU Compare-And-Swap
└── Lock-Free Programming
```

---

## 📂 07. ThreadLocal

```
07-ThreadLocal

├── Why ThreadLocal?
├── ThreadLocal Internal Working
├── ThreadLocalMap
├── WeakReference
├── Memory Leak
├── remove()
├── InheritableThreadLocal
├── Spring SecurityContext
├── TenantContext
├── MDC Logging
└── Real Industry Examples
```

Since you've already studied `TenantContext`, it fits perfectly here.

---

## 📂 08. Executor Framework

One of the biggest topics.

```
08-Executor-Framework

├── Why Thread Pool?
├── Executor
├── ExecutorService
├── ThreadPoolExecutor
├── Fixed Thread Pool
├── Cached Thread Pool
├── Single Thread Executor
├── Scheduled Executor
├── Future
├── Callable
├── FutureTask
├── CompletionService
└── Shutdown
```

---

## 📂 09. Synchronizers

These are coordination utilities.

```
09-Synchronizers

├── CountDownLatch
├── CyclicBarrier
├── Phaser
├── Semaphore
├── Exchanger
└── BlockingQueue
```

---

## 📂 10. Concurrent Collections

```
10-Concurrent-Collections

├── ConcurrentHashMap
├── CopyOnWriteArrayList
├── CopyOnWriteArraySet
├── ConcurrentLinkedQueue
├── ConcurrentSkipListMap
├── ConcurrentSkipListSet
├── BlockingQueue
├── DelayQueue
├── PriorityBlockingQueue
├── LinkedBlockingQueue
├── ArrayBlockingQueue
└── SynchronousQueue
```

---

## 📂 11. CompletableFuture

```
11-CompletableFuture

├── Future Limitations
├── CompletableFuture
├── supplyAsync()
├── runAsync()
├── thenApply()
├── thenCompose()
├── thenCombine()
├── allOf()
├── anyOf()
├── Exception Handling
└── Real Industry Example
```

---

## 📂 12. Performance & Optimization

```
12-Performance

├── False Sharing
├── Cache Line
├── CPU Cache
├── MESI Protocol
├── Memory Barrier
├── Lock Contention
├── Lock Striping
├── Busy Waiting
├── Spin Lock
└── Thread Starvation
```

---

## 📂 13. Industry Design Patterns

This folder is the most valuable for interviews.

```
13-Industry-Examples

├── Producer Consumer
├── Rate Limiter
├── Thread Pool Server
├── Async Logging
├── Cache Refresh
├── Read Heavy Systems
├── Notification Service
├── Payment Processing
├── Order Processing
├── Batch Processing
├── Tenant Context
├── Security Context
└── Web Request Handling
```

---

## 📂 14. Interview Questions

```
14-Interview

├── Tricky Questions
├── Output Questions
├── Debugging
├── Best Practices
├── Common Mistakes
└── FAQs
```

---
