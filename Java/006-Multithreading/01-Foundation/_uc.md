## Virtual Threads (Java 21) — Project Loom

### The Problem — Platform threads are expensive

Every time you handle an HTTP request in a traditional server, you assign it a **platform thread** (OS thread). OS threads are heavy:

- Each consumes ~1MB of stack memory
- OS can realistically handle only ~few thousands of them
- Most of the time the thread is just **sitting idle** waiting for DB, network, file I/O

```java
// Traditional Spring MVC model
// 1 request = 1 OS thread
// Server has thread pool of 200 threads.
// 201st request? It WAITS.

// What does each thread do most of the time?
public OrderDTO getOrder(String id) {
    Order order = db.findById(id);        // Thread BLOCKS for 50ms (DB call)
    User user = userService.fetch(order); // Thread BLOCKS for 30ms (network)
    return mapper.toDTO(order, user);     // Thread works for 1ms
    // Total: 81ms — thread was IDLE 98% of the time!
}
```

With 200 threads and each request taking 80ms mostly waiting, you can handle only ~2500 requests/second. The thread spends 99% of its life doing nothing.

### The Solution — Virtual Threads

Virtual threads are **JVM-managed**, not OS-managed. They are extremely lightweight (~few KB). You can create **millions** of them.

```java
// Virtual thread — created just like a normal thread
Thread vThread = Thread.ofVirtual().start(() -> {
    System.out.println("I'm a virtual thread!");
});

// Create 1 MILLION virtual threads — totally fine
for (int i = 0; i < 1_000_000; i++) {
    Thread.ofVirtual().start(() -> doWork());
}
// Try this with platform threads — your machine dies at ~5000
```

### How it works internally — Mounting/Unmounting

```
Virtual Thread (lightweight, millions possible)
        ↓  mounted on
Carrier Thread (platform/OS thread, small fixed pool)

When virtual thread hits a blocking call (DB, network):
  → JVM automatically UNMOUNTS it from carrier thread
  → Carrier thread picks up another virtual thread
  → When IO completes, virtual thread is REMOUNTED on any available carrier
```

```java
// This blocking code now scales to millions of concurrent requests
public OrderDTO getOrder(String id) {
    Order order = db.findById(id);        // Virtual thread unmounts, carrier is free
    User user = userService.fetch(order); // Virtual thread unmounts again
    return mapper.toDTO(order, user);
    // JVM handles all the magic — your code looks simple/blocking
}
```

### Real example — Spring Boot with Virtual Threads

```java
@SpringBootApplication
public class Application {

    // Java 21 + Spring Boot 3.2 — one line to enable virtual threads
    @Bean
    public TomcatProtocolHandlerCustomizer<?> virtualThreads() {
        return handler -> handler.setExecutor(
            Executors.newVirtualThreadPerTaskExecutor()
        );
    }
}

// Now every incoming HTTP request gets its OWN virtual thread
// No thread pool limit — 10,000 concurrent requests? Fine.
// Code stays simple blocking style — no reactive callbacks needed
```

### Virtual Threads vs Platform Threads

| | Platform Thread | Virtual Thread |
|---|---|---|
| Managed by | OS | JVM |
| Memory per thread | ~1MB | ~few KB |
| Max practical count | ~few thousand | Millions |
| Blocking behavior | Wastes OS thread | JVM switches to other work |
| Code style | Blocking or async | Blocking (simple!) |
| Best for | CPU-bound work | IO-bound work |

### What Virtual Threads are NOT for

```java
// CPU-bound work — virtual threads give NO benefit
// (thread is actively computing, not waiting)
for (int i = 0; i < 1_000_000; i++) {
    Thread.ofVirtual().start(() -> {
        cryptoHash(data); // pure CPU — use ForkJoinPool instead
    });
}
```

Virtual threads shine for **IO-bound** work. For CPU-bound, stick with `ForkJoinPool` / parallel streams.
