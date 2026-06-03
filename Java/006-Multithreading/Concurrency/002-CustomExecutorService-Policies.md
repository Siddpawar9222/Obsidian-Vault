
---

## What rejection looks like (AbortPolicy)

```java
try {
    executor.submit(() -> {
        System.out.println("Task running: " + Thread.currentThread().getName());
        Thread.sleep(5000); // simulate 5 sec work
        return null;
    });
} catch (RejectedExecutionException e) {
    // This fires when queue is full AND all threads are busy
    System.err.println("Task rejected! Queue is full: " + e.getMessage());
}
```

---

## All 4 Rejection Policies with examples

```java
// Policy 1: AbortPolicy (default)
// Throws exception — use when task loss is unacceptable
// Example: payment processing
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());


// Policy 2: CallerRunsPolicy
// The thread that submitted the task runs it itself
// This naturally slows down the submitter — acts as back-pressure
// Example: logging systems where you don't want to lose logs
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());


// Policy 3: DiscardPolicy
// Silently drops the task — no exception, no log
// Use only if task loss is acceptable
// Example: analytics/metrics pings where occasional loss is ok
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardPolicy());


// Policy 4: DiscardOldestPolicy
// Drops the OLDEST waiting task from queue, adds new task
// Example: real-time stock price updates (old price is stale anyway)
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());
```

---

##  Industry Best Practice: Custom Handler

In real systems (Amazon, Flipkart, banking apps), you never silently drop tasks. You write a **custom handler**:

```java
// Custom rejection handler — industry standard approach
RejectedExecutionHandler customHandler = (task, executorService) -> {
    // Step 1: Log it (so your team knows)
    System.err.println("[ALERT] Task rejected! Pool is overwhelmed. Task: " + task);

    // Step 2: Save to database or retry queue for later
    // retryQueue.add(task);  // save for retry

    // Step 3: Send alert to monitoring system
    // alertService.sendAlert("Thread pool full! Check server load.");
};

ThreadPoolExecutor executor = new ThreadPoolExecutor(
    2, 4,
    60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(3),
    customHandler  // plug in custom handler
);
```

---

## Quick Decision Guide

| Situation                                | Policy to use                     |
| ---------------------------------------- | --------------------------------- |
| Task must not be lost (payments, orders) | `AbortPolicy` + catch + retry     |
| Want to slow down submitter naturally    | `CallerRunsPolicy`                |
| Task loss is okay (analytics, metrics)   | `DiscardPolicy`                   |
| Only latest data matters (stock prices)  | `DiscardOldestPolicy`             |
| Production system with monitoring        | Custom `RejectedExecutionHandler` |

The key rule: **always log rejections in production**. Silent task loss causes very hard-to-debug issues.