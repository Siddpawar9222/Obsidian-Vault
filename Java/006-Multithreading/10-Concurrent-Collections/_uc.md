## 1. `ConcurrentHashMap`

### The Problem

You're building an **order tracking system**. Multiple threads are simultaneously reading and writing order statuses.

```java
// Attempt 1: Plain HashMap — DANGEROUS
Map<String, String> orderStatus = new HashMap<>();
// Thread 1: orderStatus.put("ORD-1", "SHIPPED")
// Thread 2: orderStatus.put("ORD-2", "DELIVERED")
// Result: possible infinite loop, lost updates, corrupted internal state

// Attempt 2: Hashtable — thread safe but SLOW
Map<String, String> orderStatus = new Hashtable<>();
// Every single read AND write locks the ENTIRE map
// Thread 1 reading "ORD-1" blocks Thread 2 from reading "ORD-2"
// Completely unnecessary — reads don't conflict!

// Attempt 3: Collections.synchronizedMap — same problem as Hashtable
Map<String, String> orderStatus = Collections.synchronizedMap(new HashMap<>());
// Still one lock for the entire map
```

**The core issue with Hashtable / synchronizedMap:** One lock for the entire map. 1000 threads all fight for the same lock even if they're accessing completely different keys.

### The Solution — Segment Locking (Java 7) → Node Locking (Java 8+)

```java
// ConcurrentHashMap — thread safe AND fast
Map<String, String> orderStatus = new ConcurrentHashMap<>();

// Thread 1 updating ORD-1 and Thread 2 updating ORD-2
// They lock DIFFERENT buckets — no contention, both proceed in parallel
orderStatus.put("ORD-1", "SHIPPED");    // Thread 1 — locks bucket 3
orderStatus.put("ORD-2", "DELIVERED"); // Thread 2 — locks bucket 7 — no waiting!

// Reads are lock-free entirely
String status = orderStatus.get("ORD-1"); // Thread 3 — no lock needed at all
```

### Real industrial example — Caching user sessions

```java
@Service
public class SessionCache {
    
    // Shared across all request-handling threads
    private final ConcurrentHashMap<String, UserSession> cache 
        = new ConcurrentHashMap<>();

    // Killer feature: computeIfAbsent is ATOMIC
    // "fetch from DB only if not already in cache" — no duplicate DB calls
    public UserSession getSession(String sessionId) {
        return cache.computeIfAbsent(sessionId, id -> {
            return database.fetchSession(id); // only called once, even with 100 threads
        });
    }

    public void updateSession(String sessionId, UserSession session) {
        cache.put(sessionId, session);
    }

    // Atomic check-and-update — no separate lock needed
    public void updateIfActive(String sessionId, UserSession newSession) {
        cache.computeIfPresent(sessionId, (id, existing) -> {
            if (existing.isActive()) return newSession;
            return existing; // don't update
        });
    }
}
```

### vs Hashtable vs SynchronizedMap — quick summary

| | `HashMap` | `Hashtable` | `synchronizedMap` | `ConcurrentHashMap` |
|---|---|---|---|---|
| Thread safe | ❌ | ✅ | ✅ | ✅ |
| Lock scope | None | Whole map | Whole map | Per bucket/node |
| Null keys/values | ✅ | ❌ | ✅ | ❌ |
| Read performance | Fast | Slow | Slow | Very fast (lock-free reads) |
| Write performance | Fast | Slow | Slow | Fast |

> **Rule:** Always use `ConcurrentHashMap` when map is shared across threads. Never use `Hashtable` in new code.

---

## 2. `CopyOnWriteArrayList`

### The Problem

You're building a **notification system**. You have a list of subscribers. Thousands of threads are **reading** the list every second to send notifications. But subscribers are added/removed **rarely** (maybe once a minute).

```java
// Plain ArrayList — crashes under concurrent reads + writes
List<Subscriber> subscribers = new ArrayList<>();

// Thread 1, 2, 3... (iterating to send notifications)
for (Subscriber s : subscribers) {  // ConcurrentModificationException!
    s.notify(event);                 // if any thread modifies list during iteration
}

// synchronizedList — solves crash but kills performance
List<Subscriber> subscribers = Collections.synchronizedList(new ArrayList<>());
// You must manually lock during iteration — blocks ALL readers while iterating
synchronized(subscribers) {
    for (Subscriber s : subscribers) { // holds lock for entire loop duration
        s.notify(event); // 1000 threads waiting outside
    }
}
```

### The Solution — Copy on every write

```java
List<Subscriber> subscribers = new CopyOnWriteArrayList<>();
```

**How it works:** When you write (add/remove), it creates a **complete copy** of the underlying array, modifies the copy, then swaps the reference. All ongoing readers keep reading the **old copy** uninterrupted.

```java
@Service
public class NotificationService {
    
    // Reads: lock-free, always safe to iterate
    // Writes: expensive (full copy) but rare
    private final CopyOnWriteArrayList<EventListener> listeners 
        = new CopyOnWriteArrayList<>();

    // Called rarely — on app startup or config change
    public void registerListener(EventListener listener) {
        listeners.add(listener); // internally copies entire array — expensive but rare
    }

    public void removeListener(EventListener listener) {
        listeners.remove(listener); // same — full copy, but rare
    }

    // Called thousands of times per second — completely lock-free
    public void publishEvent(OrderEvent event) {
        for (EventListener listener : listeners) { // snapshot iteration — never throws
            listener.onEvent(event);
        }
    }
}
```

### The Trade-off — This is critical to understand

```java
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("A");
list.add("B");

// Thread 1 starts iterating
Iterator<String> it = list.iterator(); // takes snapshot [A, B]

// Thread 2 adds an element
list.add("C"); // creates new copy [A, B, C]

// Thread 1 continues — sees OLD snapshot, never sees "C"
while (it.hasNext()) {
    System.out.println(it.next()); // prints A, B — not C
}
// This is by design — consistency over freshness
```

### When to use vs when NOT to use

| Scenario | Use it? |
|---|---|
| Read-heavy, write-rare (listeners, config, feature flags) | ✅ Perfect fit |
| Equal reads and writes | ❌ Too expensive |
| Write-heavy (order list, shopping cart) | ❌ Never — full copy every write |
| Small list size | ✅ Copy cost is low |
| Large list (10k+ elements) | ❌ Copy cost is too high |

---

## 3. `LinkedTransferQueue`

### The Problem

You're building a **task handoff system** between a producer and consumer — like a live support chat where a customer request must be picked up by an **available agent right now**, not queued for later.

Regular queues just store items. Nobody guarantees a consumer is actually waiting.

```java
BlockingQueue<SupportRequest> queue = new LinkedBlockingQueue<>();
queue.put(request); // just drops it in the queue and moves on
// Customer request might sit in queue for 5 seconds before an agent picks it up
```

### The Solution — Direct handoff semantics

`LinkedTransferQueue` adds one crucial method: **`transfer()`** — it blocks until a consumer **actually takes** the item. It's a direct hand-to-hand transfer.

```java
@Service
public class SupportDispatcher {
    
    private final LinkedTransferQueue<SupportRequest> queue 
        = new LinkedTransferQueue<>();

    // Producer — blocks until an agent actually picks this up
    public void dispatchRequest(SupportRequest request) throws InterruptedException {
        
        // tryTransfer — non-blocking, returns false if no agent waiting right now
        boolean handedOff = queue.tryTransfer(request);
        if (!handedOff) {
            System.out.println("No agent available, queuing request");
            queue.put(request); // fall back to queuing
        }

        // transfer() — blocks until an agent takes it
        // queue.transfer(request); // use this when you MUST guarantee handoff
    }

    // Consumer (agent thread)
    public void agentLoop(String agentId) throws InterruptedException {
        while (true) {
            SupportRequest request = queue.take(); // waits for work
            System.out.println(agentId + " handling: " + request);
            handle(request);
        }
    }
}
```

### `transfer()` vs `put()` — the key difference

```
put()      →  [item goes into queue]  →  producer continues immediately
                                         consumer picks up later

transfer() →  producer WAITS  ←→  consumer TAKES  →  both continue
              (direct handoff, like passing a baton)
```

**Real use cases:** Thread pool executors (internally uses this), work stealing, real-time task dispatch where latency matters.
