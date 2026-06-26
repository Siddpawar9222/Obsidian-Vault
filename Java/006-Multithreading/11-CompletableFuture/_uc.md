## 6. `CompletableFuture` — The real game changer

**Problem:** All of the above still blocks somewhere. Modern apps need:
- **Callbacks** (do X when this finishes)
- **Chaining** (do A, then B with A's result, then C)
- **Combining** (wait for A and B, then do C)
- **Non-blocking** throughout

`CompletableFuture` solves all of this.

### Basic async execution
```java
CompletableFuture<Integer> cf = CompletableFuture.supplyAsync(() -> {
    // Runs on ForkJoinPool.commonPool() by default
    return fetchUserScore(); // returns 85
});

// No blocking! Attach a callback
cf.thenAccept(score -> System.out.println("Score: " + score));
```

### Chaining
```java
CompletableFuture.supplyAsync(() -> fetchUserId())        // Step 1: get ID
    .thenApply(id -> fetchUserName(id))                   // Step 2: get name from ID  
    .thenApply(name -> "Hello, " + name)                  // Step 3: format
    .thenAccept(msg -> System.out.println(msg));          // Step 4: print

// Main thread is FREE — none of this blocks it
```

### Combining two independent futures
```java
CompletableFuture<String> userFuture  = CompletableFuture.supplyAsync(() -> fetchUser());
CompletableFuture<String> orderFuture = CompletableFuture.supplyAsync(() -> fetchOrders());

// When BOTH complete, combine results
userFuture.thenCombine(orderFuture, (user, orders) -> {
    return user + " has orders: " + orders;
}).thenAccept(System.out::println);
```

### Wait for ALL or ANY
```java
CompletableFuture<Void> all = CompletableFuture.allOf(cf1, cf2, cf3); // wait for all
CompletableFuture<Object> any = CompletableFuture.anyOf(cf1, cf2, cf3); // first to finish
```

### Error handling
```java
CompletableFuture.supplyAsync(() -> riskyOperation())
    .exceptionally(ex -> {
        System.out.println("Failed: " + ex.getMessage());
        return -1; // fallback value
    })
    .thenAccept(result -> System.out.println("Result: " + result));
```

---

## 7. `CompletionStage` — Just the interface

This is simply the **interface** that `CompletableFuture` implements. It defines all the chaining methods (`thenApply`, `thenAccept`, `thenCompose`, etc.).

You'll see it in method signatures when a library wants to be flexible:

```java
// Library method — returns the interface, not the concrete class
public CompletionStage<User> fetchUserAsync(int id) { ... }

// Your code — you can still chain on it
fetchUserAsync(1)
    .thenApply(User::getName)
    .thenAccept(System.out::println);
```

**Rule of thumb:** Use `CompletionStage` in APIs you expose. Use `CompletableFuture` in your implementation.
