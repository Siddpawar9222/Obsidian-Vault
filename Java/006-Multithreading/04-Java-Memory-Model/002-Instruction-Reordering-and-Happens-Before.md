
---
## 1. Instruction Reordering

### 1.1 What is Reordering?

To run as fast as possible, the **JVM** and the **CPU** are allowed to rearrange the execution order of your statements, as long as the end result in a **single thread** is the same.

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

In a **single-threaded** program, this is harmless. In **multithreading**, instruction reordering can cause catastrophic bugs, such as publishing a reference to an object before its constructor has finished running!

### 1.2 Reordering Bug: Double-Checked Locking
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


What happens when we assign the `instance` object reference internally: 

1. **Step 1 - Allocate memory**: `new PaymentProcessor()`
2. **Step 2 - Run constructor**: `gatewayUrl = "https://payment.gateway.com";`
3. **Step 3 - Assign reference**: `instance = new PaymentProcessor()`

But what CPU optimization can do here:

1. **Step 1 - Allocate memory**: `new PaymentProcessor()`
2. **Step 3 - Assign reference**: `instance = new PaymentProcessor()` *(instance is now non-null)*
3. **Step 2 - Run constructor**: `gatewayUrl = "https://payment.gateway.com";`

Now, let's suppose we have two threads: **Thread 1** and **Thread 2**.

```text
Thread 1                                     Thread 2
──────────────────────────────────────       ──────────────────────────────────────
Allocate memory
       │
       ▼
Memory (gatewayUrl = null)
       │
       ▼
Assign instance reference (← Reordered)
       │
       ▼
                                         ──► Sees instance != null
                                         ──► Returns partially initialized object
                                         ──► Reads gatewayUrl = null 
                                             (Thread 2 gets NullPointerException)
       │
       ▼
Constructor finally executes by Thread 1
       │
       ▼
Now actual full reference is passed 
with constructor value gatewayUrl
```

---

## 2. The Java Memory Model (JMM) & Happens-Before

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
* All actions in a thread happen-before a successful return from `thread.join()` in another thread.In brief 
    When `join()` finishes, Java guarantees that the thread has completed all its work, and every change it made to memory is now visible to the thread that called `join()`.

> ![[happens_before_rules_summary.svg|700x400]]

---

## 3. Cheatsheet & Summary

| Concept | What it is | Symptom of Failure | Solution |
|---|---|---|---|
| **Instruction Reordering** | JVM/CPU rearranging code execution for speed. | NullPointerExceptions, partially initialized objects. | `volatile` (prevents reordering). |
| **Happens-Before** | The JVM guarantee of memory visibility. | Code not behaving predictably across threads. | Follow JMM synchronization rules. |

---

