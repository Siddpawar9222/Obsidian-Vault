# Java Multithreading: Synchronization & Memory Visibility

---

## 1. Race Conditions & Critical Sections

### 1.1 What is a Race Condition?
Imagine a shared bank account with ₹1,000. Two people (Thread A and Thread B) try to withdraw ₹500 at the exact same time.

Without proper control, the following sequence occurs:
1. **Thread A** reads the balance: `₹1000`.
2. **Thread B** reads the balance: `₹1000` (simultaneously).
3. **Thread A** calculates new balance: `₹500` and saves it.
4. **Thread B** calculates new balance: `₹500` and saves it.
5. **Result**: Both withdrew ₹500 (total ₹1,000 taken out), but the final balance is ₹500 instead of ₹0!

A **Race Condition** happens when multiple threads try to read and write to the same shared variable at the same time, causing unpredictable or corrupted data.
The block of code where shared data is accessed and modified is called the **Critical Section**.

> ![[race_condition_bank.svg|700x400]]

### 1.2 Buggy Code Example (The Race Condition)

Here is how this bug manifests in Java code:

```java
public class RaceConditionDemo {
    private static class BankAccount {
        private int balance = 1000; // Shared resource

        // Critical Section
        public void withdraw(int amount) {
            if (balance >= amount) {
                // GAP: Thread A reads balance here, then pauses. 
                // Thread B jumps in, reads the same balance, and enters the block!
                balance = balance - amount;
                System.out.println(Thread.currentThread().getName() 
                    + " withdrew ₹" + amount + " | Balance: ₹" + balance);
            }
        }
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount();

        // Two threads accessing the same account object
        Thread teller1 = new Thread(() -> account.withdraw(500), "Teller-1");
        Thread teller2 = new Thread(() -> account.withdraw(500), "Teller-2");

        teller1.start();
        teller2.start();
    }
}
```

**Incorrect Output (Sample):**
```text
Teller-1 withdrew ₹500 | Balance: ₹500
Teller-2 withdrew ₹500 | Balance: ₹500  👈 BUG: ₹1000 withdrawn, but balance is still ₹500!
```

---

## 2. Intrinsic Locks & Synchronization

### 2.1 The Concept of a Monitor Lock
To solve race conditions, Java uses a concept called the **Intrinsic Lock** (or **Monitor Lock**).
* Think of every Java object as having a **single key** to a locked room.
* If a thread wants to enter a synchronized method, it must acquire that key.
* If another thread tries to enter, it is locked out (**blocked**) and must wait until the first thread exits and returns the key.

> ![[intrinsic_lock_monitor.svg|700x400]]

### 2.2 Solution 1: Synchronized Method
By adding `synchronized` to the method signature, Java automatically acquires the lock of `this` object when a thread enters, and releases it when the thread leaves.

```java
public class SynchronizedMethodDemo {
    private static class BankAccount {
        private int balance = 1000;

        // 'synchronized' ensures only ONE thread can execute this method at a time
        public synchronized void withdraw(int amount) {
            if (balance >= amount) {
                balance = balance - amount;
                System.out.println(Thread.currentThread().getName() 
                    + " withdrew ₹" + amount + " | Balance: ₹" + balance);
            } else {
                System.out.println(Thread.currentThread().getName() + " - Insufficient balance");
            }
        }
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        new Thread(() -> account.withdraw(500), "Teller-1").start();
        new Thread(() -> account.withdraw(500), "Teller-2").start();
    }
}
```

### 2.3 Solution 2: Synchronized Block (Fine-Grained Locking)
Synchronizing an entire method can slow down your code if the method does other tasks (like calling an API or reading a file) that don't need a lock.
A **synchronized block** allows you to lock **only** the critical section, using a dedicated lock object (industry standard).

```java
public class SynchronizedBlockDemo {
    private static class BankAccount {
        private int balance = 1000;
        private final Object lock = new Object(); // Dedicated lock object

        public void withdraw(int amount) {
            // Non-critical operations can go here (unlocked, runs in parallel)
            System.out.println(Thread.currentThread().getName() + " preparing withdrawal...");

            synchronized (lock) { // Critical section starts
                if (balance >= amount) {
                    balance = balance - amount;
                    System.out.println(Thread.currentThread().getName() 
                        + " withdrew ₹" + amount + " | Balance: ₹" + balance);
                }
            } // Lock is released here automatically
        }
    }
}
```

---

## 3. The Memory Visibility Problem

### 3.1 Why Memory Visibility Bugs Happen
In modern computers, CPUs have multiple cores, and each core has its own ultra-fast **CPU cache**.
* When a thread reads a variable, it often copies it from the main computer memory into its CPU cache.
* If **Thread A** updates a variable, it might update its local CPU cache first.
* If **Thread B** reads the same variable from a different core, it might read its own stale CPU cache, remaining unaware of Thread A's update.

```text
Thread A (Core 1) writes status = "COMPLETED" (in Core 1 Cache)
Thread B (Core 2) reads status               -> "PENDING" (from Core 2 Cache/Main Memory)
```

> ![[jmm_cpu_cache_visibility.svg|700x400]]

### 3.2 The `volatile` Keyword
Declaring a variable as `volatile` forces Java to read and write the variable **directly from/to main memory**, bypassing CPU caches. All threads will see the most up-to-date value immediately.

```java
public class VisibilityDemo {
    private static volatile boolean keepRunning = true; // volatile ensures visibility

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (keepRunning) {
                // If keepRunning was not volatile, this thread might cache it as true
                // and loop forever, even after the main thread sets it to false.
            }
            System.out.println("Worker thread stopped!");
        });

        worker.start();
        Thread.sleep(1000);
        
        System.out.println("Main thread request stop...");
        keepRunning = false; // Writes directly to main memory
    }
}
```

> [!important] IMPORTANT LIMITATION
> `volatile` only solves **visibility** (ensuring threads see changes). It **does not** solve race conditions (atomicity).
> For compound operations like `count++` (which is actually: read -> increment -> write), `volatile` is not enough. You must use `synchronized` or atomic classes (e.g., `AtomicInteger`).

---

## 4. Instruction Reordering

### 4.1 What is Reordering?
To run as fast as possible, the JVM and the CPU are allowed to rearrange the execution order of your statements, as long as the end result in a single thread is the same.

```java
// What you write:
int a = 1;   // Step 1
int b = 2;   // Step 2
int c = a;   // Step 3

// What the CPU might actually execute:
int b = 2;   // Step 2 executes first
int a = 1;   // Step 1
int c = a;   // Step 3
```

In a single-threaded program, this is harmless. In multithreading, reordering can cause catastrophic bugs, such as publishing a reference to an object before its constructor has finished running!

### 4.2 Reordering Bug: Double-Checked Locking
Consider a Singleton class initialized via double-checked locking:

```java
public class PaymentProcessor {
    // ❌ BUG: Without volatile, instruction reordering can break this!
    // private static PaymentProcessor instance;

    // ✅ FIXED: volatile prevents instruction reordering around this reference
    private static volatile PaymentProcessor instance;

    private String gatewayUrl;

    private PaymentProcessor() {
        gatewayUrl = "https://payment.gateway.com"; // Step A
    }

    public static PaymentProcessor getInstance() {
        if (instance == null) { // Check 1 (No lock)
            synchronized (PaymentProcessor.class) {
                if (instance == null) { // Check 2 (Locked)
                    instance = new PaymentProcessor(); 
                    // This object creation does three things:
                    // 1. Allocate memory
                    // 2. Run constructor (Step A: set gatewayUrl)
                    // 3. Assign memory address to 'instance' variable
                    //
                    // Without 'volatile', the compiler can reorder 3 before 2.
                    // Another thread checking Check 1 might see 'instance' is NOT null,
                    // return it, and attempt to read gatewayUrl while it is still null!
                }
            }
        }
        return instance;
    }
}
```

---

## 5. The Java Memory Model (JMM) & Happens-Before

The JMM is the formal specification defining how Java threads interact with memory. It establishes a set of rules called **Happens-Before** to guarantee visibility of memory writes between threads.

> **Happens-Before Rule:** If Action A happens-before Action B, then the results of Action A are guaranteed to be visible to Action B.

Here are the three primary JMM rules you need to know:

### Rule 1: Monitor Lock Rule (Synchronized)
Any write to a variable inside a synchronized block is guaranteed visible to any thread acquiring the **same lock** afterwards.

```java
synchronized(lock) {
    sharedValue = 42; // Action A
} // Lock Released here

// --- Later in another thread ---

synchronized(lock) { // Lock Acquired here
    System.out.println(sharedValue); // Action B (Guaranteed to print 42)
}
```

### Rule 2: Volatile Variable Rule
A write to a `volatile` variable happens-before every subsequent read of that same variable.
Furthermore, any variables updated *before* writing to a `volatile` variable are also flushed to main memory and made visible.

```java
// Thread A
nonVolatileData = 99; 
statusFlag = true; // Volatile Write (acts as a memory fence)

// Thread B
if (statusFlag == true) { // Volatile Read
    System.out.println(nonVolatileData); // Guaranteed to print 99!
}
```

### Rule 3: Thread Start / Join Rule
* Calling `thread.start()` happens-before any actions in the started thread.
* All actions in a thread happen-before a successful return from `thread.join()` in another thread.

> ![[happens_before_rules_summary.svg|700x400]]

---

## 6. Cheatsheet & Summary

| Concept | What it is | Symptom of Failure | Solution |
|---|---|---|---|
| **Race Condition** | Multiple threads modifying shared data concurrently. | Data corruption, incorrect final values (e.g., balance). | `synchronized` block/method, or Lock API. |
| **Critical Section** | The block of code that accesses the shared data. | Thread collision area. | Protect using lock locks. |
| **Intrinsic Lock** | The implicit lock attached to every Java object. | Threads overwriting each other's progress. | Acquired via `synchronized`. |
| **Memory Visibility** | Core cache storing outdated local copies of variables. | Infinite loops, threads reading old values. | `volatile` or `synchronized`. |
| **Instruction Reordering** | JVM/CPU rearranging code execution for speed. | NullPointerExceptions, partially initialized objects. | `volatile` (prevents reordering). |
| **Happens-Before** | The JVM guarantee of memory visibility. | Code not behaving predictably across threads. | Follow JMM synchronization rules. |

---

*Java Concurrency Series — Synchronization & Visibility | Siddhesh's Notes*
