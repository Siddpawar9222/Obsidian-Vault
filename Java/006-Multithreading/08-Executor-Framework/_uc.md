## 1. `Callable` — A task that returns a value

**Problem:** `Runnable` can't return a value or throw checked exceptions.

```java
// Runnable - no return value
Runnable r = () -> System.out.println("done"); // can't return anything

// Callable - returns a value
Callable<Integer> task = () -> {
    Thread.sleep(1000); // simulate work
    return 42;
};
```

`Callable` is just a functional interface. It does nothing on its own — you need something to **run** it and **hold** its result. That's where `Future` comes in.

---

## 2. `Future` — "I'll give you the result later"

**Problem:** You submit a task to another thread. How do you get its result back?

`Future` is like a **receipt**. You submit work, get a receipt, and later you can come back and collect the result.

```java
ExecutorService executor = Executors.newFixedThreadPool(2);

// Submit work, get a Future (receipt) immediately
Future<Integer> future = executor.submit(() -> {
    Thread.sleep(2000); // heavy computation
    return 42;
});

// You can do other work here while task runs in background
System.out.println("Doing other stuff...");

// Now collect the result — this BLOCKS until result is ready
Integer result = future.get(); // blocks here if not done yet
System.out.println("Result: " + result); // 42
```

**The big problem with `Future`:** `future.get()` **blocks your thread**. You're back to waiting. Also:
- Can't chain: "when this finishes, do that"
- Can't combine: "when both A and B finish, do C"
- No callbacks
- Can't manually complete it.

---

## 3. `FutureTask` — `Future` + `Runnable` in one

**Problem:** Sometimes you want to wrap a `Callable` into something you can both **run yourself** and **get a result from**.

`FutureTask` implements both `Future` and `Runnable`. So you can run it manually (in a thread, or directly) while still being able to call `.get()` on it.

```java
Callable<String> callable = () -> {
    Thread.sleep(1000);
    return "Hello from FutureTask";
};

FutureTask<String> futureTask = new FutureTask<>(callable);

// You control how it runs — pass to a thread manually
Thread thread = new Thread(futureTask);
thread.start();

// Somewhere later...
String result = futureTask.get(); // blocks
System.out.println(result);
```

**When would you use this over plain `Future`?**
When you're not using an `ExecutorService` and want to manually control thread execution — or when you want to pass the same task to multiple places (since `FutureTask` caches its result).

---

## 5. `CompletionService` — Process tasks as they complete

**Problem:** You submit 10 tasks. You don't care about order — you want to process each result **as soon as it's ready**, not wait for them in submission order.

```java
ExecutorService executor = Executors.newFixedThreadPool(3);
CompletionService<String> completionService = 
    new ExecutorCompletionService<>(executor);

// Submit 3 tasks with different durations
completionService.submit(() -> { Thread.sleep(3000); return "slow task"; });
completionService.submit(() -> { Thread.sleep(500);  return "fast task"; });
completionService.submit(() -> { Thread.sleep(1500); return "medium task"; });

// Process results AS THEY COMPLETE (not in submission order)
for (int i = 0; i < 3; i++) {
    Future<String> done = completionService.take(); // blocks until ANY one finishes
    System.out.println("Got: " + done.get());
}
// Prints: fast task → medium task → slow task
```

Internally it uses a **blocking queue** — completed tasks are placed in the queue, and you just drain from it.

---

## 8. `ForkJoinTask` — Divide and conquer

**Problem:** Some tasks can be **split into subtasks**, solved in parallel, then **merged**. Like summing a huge array — split it in half, sum each half in parallel, add the two sums.

`ForkJoinTask` is the base class. You use `RecursiveTask` (returns value) or `RecursiveAction` (no return).

```java
class SumTask extends RecursiveTask<Long> {
    private final int[] arr;
    private final int start, end;
    static final int THRESHOLD = 1000;

    SumTask(int[] arr, int start, int end) {
        this.arr = arr; this.start = start; this.end = end;
    }

    @Override
    protected Long compute() {
        if (end - start <= THRESHOLD) {
            // Small enough — do it directly
            long sum = 0;
            for (int i = start; i < end; i++) sum += arr[i];
            return sum;
        }

        int mid = (start + end) / 2;
        SumTask left  = new SumTask(arr, start, mid);
        SumTask right = new SumTask(arr, mid, end);

        left.fork();              // run left in parallel
        long rightResult = right.compute(); // run right on current thread
        long leftResult  = left.join();     // wait for left

        return leftResult + rightResult;
    }
}

// Run it
ForkJoinPool pool = new ForkJoinPool();
int[] bigArray = new int[1_000_000]; // filled with data
long total = pool.invoke(new SumTask(bigArray, 0, bigArray.length));
```

`ForkJoinPool` uses **work stealing** — idle threads steal tasks from busy threads' queues. Very efficient for CPU-bound parallel work.

---

## 9. `StructuredTaskScope` (Java 21) — Modern structured concurrency

**Problem:** With `CompletableFuture`, if you spawn 3 tasks and one fails, the others keep running (wasting resources). There's no clean "if any fails, cancel all" or "if any succeeds, cancel the rest" built in.

Also, debugging is a nightmare because tasks float across threads with no parent-child relationship.

`StructuredTaskScope` brings **structure** — tasks have a clear **scope**, and when the scope ends, all tasks are done (or cancelled).

```java
// Pattern 1: Wait for ALL to succeed (fail fast if any fails)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    
    Subtask<String> user   = scope.fork(() -> fetchUser(id));
    Subtask<String> orders = scope.fork(() -> fetchOrders(id));
    Subtask<String> prefs  = scope.fork(() -> fetchPreferences(id));

    scope.join();           // wait for all
    scope.throwIfFailed();  // if any failed, throw exception (others auto-cancelled)

    // All three succeeded
    process(user.get(), orders.get(), prefs.get());
}
// Scope exits — all tasks guaranteed complete or cancelled
```

```java
// Pattern 2: Return first success (cancel the rest)
try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
    
    scope.fork(() -> fetchFromPrimaryDB());
    scope.fork(() -> fetchFromCache());
    scope.fork(() -> fetchFromBackupDB());

    scope.join();
    String result = scope.result(); // whichever finished first
    // Other two are automatically cancelled
}
```

**Why it's better than CompletableFuture for this:**
- Clean cancellation — no orphan threads
- Clear lifetime — tasks can't outlive their scope
- Better stack traces for debugging
