
---

# Part 1 — Race Conditions & Critical Sections

## What is a Race Condition?

Imagine a bank. Two people (Thread A and Thread B) both want to withdraw ₹500 from an account that has ₹1000.

**Without proper control, this happens:**

- Thread A reads balance → ₹1000
- Thread B reads balance → ₹1000 (at the same time!)
- Thread A withdraws → saves ₹500
- Thread B withdraws → saves ₹500
- Final balance = ₹500, but ₹1000 was taken out!

This is a **Race Condition** — two threads "racing" to read/write the same data, causing wrong results.

The piece of code where this shared data is accessed is called a **Critical Section**.

> ![[race_condition_bank.svg|700x400]]

Now let's see this as actual Java code — first the **buggy version**, then **why it breaks**:

```java
// BUGGY CODE — Race Condition example
// Real-world scenario: Two bank tellers processing withdrawals simultaneously

public class BankAccount {
    
    private int balance = 1000; // Shared resource — THIS is the critical section

    // This method is the "critical section" — accessed by multiple threads
    public void withdraw(int amount) {
        
        // Step 1: Thread reads balance from memory
        if (balance >= amount) {
            
            // GAP HERE — another thread can jump in at this exact point!
            // Thread A reads 1000, Thread B also reads 1000
            // Both think they can withdraw ₹500
            
            // Step 2: Subtract
            balance = balance - amount;
            // Step 3: Write back — Thread B OVERWRITES Thread A's result
            
            System.out.println(Thread.currentThread().getName() 
                + " withdrew ₹" + amount 
                + " | Balance: ₹" + balance);
        }
    }
}

public class RaceConditionDemo {
    public static void main(String[] args) {
        
        BankAccount account = new BankAccount(); // ONE shared account object

        // Two threads — like two bank tellers using same account
        Thread teller1 = new Thread(() -> account.withdraw(500), "Teller-1");
        Thread teller2 = new Thread(() -> account.withdraw(500), "Teller-2");

        teller1.start(); // Both start almost simultaneously
        teller2.start(); // Race condition begins!
    }
}
```

**Possible wrong output:**
```
Teller-1 withdrew ₹500 | Balance: ₹500
Teller-2 withdrew ₹500 | Balance: ₹500  ← Wrong! Should be ₹0
```

---

# Part 2 — Intrinsic Locks & Monitor Concept

Every Java object has a built-in lock called an **Intrinsic Lock** (also called a **Monitor Lock**). Think of it like a **single key to a room**. Only one thread can hold the key at a time.

When you use the `synchronized` keyword, you are using this lock.

>  ![[intrinsic_lock_monitor.svg|700x400]]

Now the **fixed version** using `synchronized`:

```java
// FIXED CODE — Using Intrinsic Lock (Monitor)
public class BankAccount {
    
    private int balance = 1000;

    // 'synchronized' = "acquire the intrinsic lock of THIS object before entering"
    // Only ONE thread can execute this method at a time
    public synchronized void withdraw(int amount) {
        
        // MONITOR ENTRY: Thread acquires the lock here
        // All other threads calling this method will BLOCK and wait

        if (balance >= amount) {
            
            // No other thread can interrupt here — we own the lock
            balance = balance - amount;
            
            System.out.println(Thread.currentThread().getName()
                + " withdrew ₹" + amount
                + " | Balance: ₹" + balance);
        } else {
            System.out.println(Thread.currentThread().getName()
                + " — insufficient balance");
        }

        // MONITOR EXIT: Lock is automatically released here
        // The JVM guarantees this even if an exception is thrown
    }
}
```

You can also use a **synchronized block** (more flexible — you choose which object's lock to use):

```java
public class BankAccount {
    
    private int balance = 1000;
    
    // A dedicated lock object — industry best practice
    // Gives you fine-grained control over what you're locking
    private final Object lock = new Object();

    public void withdraw(int amount) {
        
        // Lock only the critical section, not the whole method
        // This is better performance in large methods
        synchronized (lock) {
            // Critical section starts
            if (balance >= amount) {
                balance = balance - amount;
                System.out.println(Thread.currentThread().getName()
                    + " withdrew ₹" + amount
                    + " | Balance: ₹" + balance);
            }
            // Critical section ends — lock released automatically
        }

        // Code here runs WITHOUT the lock — more parallelism possible
    }
}
```

**Key concept:** `synchronized(this)` uses the object's own lock. `synchronized(lock)` uses a separate lock object. Both use the same intrinsic lock mechanism — just different objects.

---

# Part 3 — Java Memory Model (JMM)

This is where it gets really deep. The JMM explains **what each thread can see** in memory and **when**.

## The Problem First

Modern computers have **CPU caches**. Each thread may work on its **own local copy** of a variable. This causes a shocking problem:

```
Thread A writes balance = 500
Thread B reads balance → still sees 1000!  ← Because it reads from its CPU cache!
```

> ![[jmm_cpu_cache_visibility.svg|700x400]]

## Happens-Before Rules

The JMM defines **happens-before** as a guarantee: *"If action A happens-before action B, then everything A did is visible to B."*

Think of it like a **contract between threads**. Java gives you several ways to establish this contract:

```java
// RULE 1: synchronized establishes happens-before
// Everything Thread A did BEFORE releasing the lock
// is guaranteed visible to Thread B AFTER it acquires the same lock

public class OrderService {
    
    private String orderStatus = "PENDING";
    private final Object lock = new Object();

    // Thread A: Update order status
    public void updateStatus(String status) {
        synchronized (lock) {
            orderStatus = status;
            // LOCK RELEASED HERE
            // All writes above are now flushed to main memory
        }
    }

    // Thread B: Read order status
    public String getStatus() {
        synchronized (lock) {
            // LOCK ACQUIRED HERE
            // Guaranteed to see what Thread A wrote before releasing its lock
            return orderStatus;
        }
    }
}
```

```java
// RULE 2: volatile establishes happens-before for that variable ONLY
// Best for simple flags — not for compound operations like balance--

public class InventoryService {
    
    // 'volatile' means:
    // 1. Read/write always goes directly to main memory (no caching)
    // 2. All threads see the latest value immediately
    // 3. Prevents instruction reordering around this variable
    
    private volatile boolean stockUpdated = false;
    private int stockCount = 0; // Not volatile — protected by happens-before of volatile

    // Thread A: Supplier updates stock
    public void replenishStock(int count) {
        stockCount = count;         // Write stockCount first
        stockUpdated = true;        // THEN set the flag (volatile write)
        // The volatile write to stockUpdated acts as a "memory fence"
        // Everything before this write IS visible to whoever reads stockUpdated
    }

    // Thread B: Warehouse checks stock
    public void checkStock() {
        if (stockUpdated) {         // Volatile read
            // Guaranteed: stockCount is also visible with correct value
            // Because stockCount was written BEFORE the volatile write of stockUpdated
            System.out.println("Stock updated: " + stockCount);
        }
    }
}
```

## Instruction Reordering

This is the most surprising concept. The **JVM and CPU are allowed to reorder your code** for performance — as long as it doesn't break single-threaded behavior. But this breaks multithreaded code!

```java
// What YOU write:
int a = 1;      // Step 1
int b = 2;      // Step 2
int c = a + b;  // Step 3

// What CPU might ACTUALLY execute (reordered):
int b = 2;      // Step 2 first (CPU found it more efficient)
int a = 1;      // Then Step 1
int c = a + b;  // Still correct in single thread
```

In multithreading, reordering can cause **another thread to see partially constructed objects** — a very dangerous bug:

```java
// DANGEROUS: Double-Checked Locking WITHOUT volatile (classic Java bug)
// Real-world example: Singleton payment processor

public class PaymentProcessor {
    
    // WITHOUT volatile — BUG! Another thread may see a partially initialized object
    // WITH volatile — SAFE! volatile prevents reordering
    private static volatile PaymentProcessor instance; // 'volatile' is CRITICAL here

    private String gatewayUrl;
    private int connectionTimeout;

    private PaymentProcessor() {
        gatewayUrl = "https://payment.gateway.com"; // Step A
        connectionTimeout = 5000;                   // Step B
        // WITHOUT volatile, CPU might reorder: publish reference BEFORE Step A or B complete
        // Another thread could get a non-null instance with null gatewayUrl!
    }

    public static PaymentProcessor getInstance() {
        
        if (instance == null) {              // First check — no lock (fast path)
            synchronized (PaymentProcessor.class) {
                if (instance == null) {      // Second check — with lock (safe)
                    instance = new PaymentProcessor();
                    // 'volatile' ensures: object is FULLY constructed before
                    // the reference is published to other threads
                    // Without volatile: another thread might see instance != null
                    // but the object fields are still being initialized!
                }
            }
        }
        return instance;
    }
}
```

Let me show all three JMM happens-before rules together visually:

> ![[happens_before_rules_summary.svg|700x400]]

---

# Quick Summary — Senior Developer Cheatsheet

| Concept                | What it means                                                  | Solution                                    |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------- |
| Race condition         | Two threads read/write same data simultaneously → wrong result | `synchronized`                              |
| Critical section       | The code block that accesses shared data                       | Protect with lock                           |
| Intrinsic lock         | Every Java object's built-in lock                              | Used by `synchronized`                      |
| Monitor                | The mechanism that owns the lock and manages waiting threads   | JVM built-in                                |
| Memory visibility      | Thread sees stale value from CPU cache                         | `volatile` or `synchronized`                |
| Happens-before         | Formal guarantee of what is visible to which thread            | `synchronized`, `volatile`, `Thread.join()` |
| Instruction reordering | JVM/CPU reorders code for speed — breaks multithreading        | `volatile` prevents reordering              |

---

**What to practice next:**
1. Run the buggy `BankAccount` code 10 times — notice the inconsistent output
2. Add `synchronized` and see it become consistent
3. Try the `volatile` flag pattern in `InventoryService`
4. Implement the `PaymentProcessor` singleton — understand why `volatile` is non-negotiable there


---



