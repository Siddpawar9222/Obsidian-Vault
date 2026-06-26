## 2. Reactive Concurrency — Project Reactor

### The Problem — Callback hell and resource waste

Even before virtual threads, people tried to solve the blocking problem with **async callbacks**. But it got ugly fast:

```java
// Async callback hell — real code looks like this
userService.fetchAsync(userId, user -> {
    orderService.fetchAsync(user.getId(), orders -> {
        inventoryService.checkAsync(orders, inventory -> {
            if (inventory.isAvailable()) {
                paymentService.chargeAsync(user, amount, payment -> {
                    notificationService.sendAsync(user, payment, result -> {
                        // You're now 5 levels deep — impossible to read
                        // Error handling? Good luck.
                    });
                });
            }
        });
    });
});
```

### The Solution — Reactive Streams with `Mono` and `Flux`

Project Reactor gives you a **declarative pipeline** — you describe *what* to do, not *how to thread it*.

**`Mono`** = 0 or 1 item (like `CompletableFuture`)
**`Flux`** = 0 to N items (like a stream)

```java
// Mono — single async value
Mono<User> userMono = userService.fetchUser(userId); // returns immediately, no blocking

// Flux — async stream of values  
Flux<Order> ordersFlux = orderService.fetchOrders(userId); // stream of orders
```

### Real industrial example — E-commerce checkout

```java
@Service
public class CheckoutService {

    public Mono<CheckoutResult> checkout(String userId, Cart cart) {
        
        return userService.fetchUser(userId)              // Step 1: get user
            .flatMap(user ->
                Mono.zip(
                    inventoryService.check(cart),          // Step 2a: check stock
                    pricingService.calculate(cart, user)   // Step 2b: calculate price
                )                                          // Steps 2a & 2b run in PARALLEL
            )
            .flatMap(tuple -> {
                Inventory inv = tuple.getT1();
                Price price   = tuple.getT2();
                
                if (!inv.isAvailable()) {
                    return Mono.error(new OutOfStockException());
                }
                return paymentService.charge(userId, price); // Step 3: charge
            })
            .flatMap(payment ->
                notificationService.send(userId, payment)   // Step 4: notify
            )
            .map(notification -> new CheckoutResult("SUCCESS"))
            .onErrorResume(OutOfStockException.class, ex ->
                Mono.just(new CheckoutResult("OUT_OF_STOCK")) // error handling
            );
    }
}
```

Clean pipeline. No callback nesting. Error handling in one place.

### Backpressure — The killer feature of Reactive

**The problem backpressure solves:**

```
Producer (Kafka/DB) → pumping 100,000 events/sec
Consumer (your service) → can only handle 1,000 events/sec

Without backpressure: Consumer runs out of memory and crashes
With backpressure:    Consumer tells Producer "slow down, I'm full"
```

```java
Flux.range(1, 1_000_000)               // producer: 1M items
    .onBackpressureBuffer(500)          // buffer max 500, drop rest or error
    .publishOn(Schedulers.boundedElastic())
    .subscribe(new BaseSubscriber<>() {
        
        @Override
        protected void hookOnSubscribe(Subscription sub) {
            request(10); // "I can handle 10 items to start"
        }

        @Override
        protected void hookOnNext(Integer value) {
            process(value);
            request(10); // "done, give me 10 more"
            // Consumer controls the pace — producer can't overwhelm it
        }
    });
```

### Schedulers — controlling which thread runs what

```java
Flux.fromIterable(orderIds)
    .publishOn(Schedulers.boundedElastic())  // IO work on elastic thread pool
    .flatMap(id -> orderService.fetch(id))   // DB calls here
    .publishOn(Schedulers.parallel())        // CPU work on parallel pool
    .map(order -> heavyTransform(order))     // computation here
    .subscribeOn(Schedulers.single())        // subscription on single thread
    .subscribe(result -> send(result));
```

### Reactive vs Virtual Threads — when to use which

| | Virtual Threads | Reactive (Project Reactor) |
|---|---|---|
| Code style | Simple blocking | Functional pipeline |
| Learning curve | Low | High |
| Backpressure | ❌ No built-in | ✅ First-class |
| Debugging | Easy (normal stack traces) | Hard (async stack traces) |
| Best for | Simple IO-bound services | High-throughput streaming, event-driven |
| Adoption | Growing fast | Established (WebFlux) |
