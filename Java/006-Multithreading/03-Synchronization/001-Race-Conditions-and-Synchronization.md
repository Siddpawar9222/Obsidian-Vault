
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
* **Hidden Monitor Lock:** Every Java object has a hidden monitor lock. When you synchronize code on an object, the thread must acquire this monitor lock before proceeding.
* **Locking the Monitor, Not the Data:** A thread acquires the lock associated with that object. As long as it holds that lock, no other thread can enter *any code that tries to acquire the same object's lock*.
* **Data Remains Accessible:** The object's fields and unsynchronized methods remain accessible to any other threads. `synchronized` does not prevent other threads from accessing the object; it only blocks threads trying to enter code synchronized on the same monitor lock.

> ![[intrinsic_lock_monitor.svg|700x400]]

### 2.2 Synchronized Instance Method vs. `synchronized(this)` Block
When you use `synchronized` on an instance method, the thread automatically acquires the monitor lock of the current object (`this`).

```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++; // Acquires the monitor lock of 'this' object
    }

    public synchronized void decrement() {
        count--; // Also requires the monitor lock of 'this' object
    }
}
```

Suppose we instantiate the object:
```java
Counter counter = new Counter();
```
* **Thread-1** calls `counter.increment()` $\rightarrow$ acquires the lock of the `counter` object.
* **Thread-2** calls `counter.decrement()` concurrently $\rightarrow$ **waits** because it needs the same `counter` object lock, even though it is calling a different method.

#### Fine-Grained Locking: `synchronized(this)` Block
Synchronizing an entire method locks the object for the entire duration of the method call. If a method performs tasks that do not need to be thread-safe (e.g., input validation, API calls, logging), you can lock only the critical section using a `synchronized(this)` block.

```java
public void process() {
    validate(); // Non-critical: Runs in parallel without lock

    synchronized(this) {
        calculate(); // Critical section: Holds the 'this' object lock
    }

    save(); // Non-critical: Runs in parallel without lock
}
```
* **Synchronized Method:** Lock is held during `validate() + calculate() + save()`.
* **Synchronized Block:** Lock is held only during `calculate()`. <font color="#ffc000">This minimizes lock hold time and improves concurrency</font>.

```text
Thread-1
|
|---- non-critical (validate) ----|
|======= LOCK ACQUIRED (this) =====|
|          calculate()            |
|======= LOCK RELEASED (this) =====|
|---- non-critical (save) --------|
```

### 2.3 Accessing Unsynchronized Code (The "House Analogy")
It is common to say "the entire object is locked," but this is a simplification. More accurately:
> **`synchronized` locks the object's monitor, not the object itself.** Unsynchronized code can still execute on the same object at the same time.

#### The House Analogy
Imagine a house containing multiple rooms:
```text
        House
   +----------------+
   | Kitchen  🔒    |  <-- Locked Room (Synchronized Block/Method)
   | Bedroom        |  <-- Unlocked Room (Unsynchronized Method)
   | Bathroom       |  <-- Unlocked Room (Unsynchronized Method)
   +----------------+
```
If a person locks themselves in the Kitchen, they own that room's lock. Other people can still enter the Bedroom or Bathroom. They are only blocked if they try to enter the Kitchen.

#### Code Demonstration
```java
class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++; // Acquires lock of 'this' object
    }

    public void print() {
        System.out.println(count); // Unsynchronized method
    }
}
```
* **Thread-1** calls `counter.increment()` $\rightarrow$ acquires the lock of `counter`.
* **Thread-2** calls `counter.print()` concurrently $\rightarrow$ **Does NOT wait** because `print()` is not synchronized. It reads the current value of `count` immediately.
* **Thread-3** calls another synchronized method $\rightarrow$ **Waits** until Thread-1 releases the lock.

> [!WARNING] Race Conditions on Unsynchronized Access
> Because unsynchronized methods (like `print()`) can run concurrently while another thread holds the lock, they can read stale or partially modified data. If data consistency is required, you must synchronize reads as well.

### 2.4 Multiple Objects = Multiple Locks
Locks belong to specific object instances, not the class or its methods.

```java
Counter c1 = new Counter();
Counter c2 = new Counter();
```
* **Thread-1** calls `c1.increment()` $\rightarrow$ acquires the lock of `c1`.
* **Thread-2** calls `c2.increment()` $\rightarrow$ acquires the lock of `c2`.
* Both threads run **simultaneously** without blocking because they lock different monitor objects (`c1`'s lock vs `c2`'s lock).

```text
Thread-1 ---> [ c1 | Lock 1 🔒 ] (Acquired)
Thread-2 ---> [ c2 | Lock 2 🔒 ] (Acquired)
```

### 2.5 Static Synchronized Methods (Class-Level Locks)
When a static method is synchronized, there is no instance object (`this`) to lock. Instead, the thread locks the **Class Object** (`ClassName.class`).

```java
public class Counter {
    public static synchronized void printHeader() {
        // Acquires lock on Counter.class
    }
}
```
* All instances of the class share the same class-level lock.
* If **Thread-1** calls `c1.printHeader()` and **Thread-2** calls `c2.printHeader()`, Thread-2 **will block** because both are trying to acquire the same `Counter.class` monitor lock.

### 2.6 Quick Revision: Synchronization Targets

| Synchronization Type | Lock Acquired On | Scope & Concurrency Impact |
| :--- | :--- | :--- |
| `synchronized` instance method | Current instance (`this`) | Blocks all other synchronized instance methods on the same object. |
| `synchronized(this)` block | Current instance (`this`) | Blocks only code requiring the same object lock; runs non-critical code in parallel. |
| `synchronized(otherObject)` block | Explicit `otherObject` instance | Blocks only code synchronized on `otherObject`. Good for separating concerns (independent locks). |
| `static synchronized` method | Class object (`ClassName.class`) | Blocks all static synchronized methods across all instances of the class. |

### 2.7 Solution 2: Dedicated Lock Objects (Best Practice)
Synchronizing on `this` exposes your lock object to the outside world. If external code gets a reference to your object and synchronizes on it, it can cause unexpected blocking or deadlocks. To prevent this, it is best practice to use a private, dedicated lock object:

```java
public class BankAccount {
    private int balance = 1000;
    private final Object lock = new Object(); // Private, dedicated lock object

    public void withdraw(int amount) {
        // Non-critical operations can run in parallel
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
```

---

## 3. Cheatsheet & Summary

| Concept | What it is | Symptom of Failure | Solution |
|---|---|---|---|
| **Race Condition** | Multiple threads modifying shared data concurrently. | Data corruption, incorrect final values (e.g., balance). | `synchronized` block/method, or Lock API. |
| **Critical Section** | The block of code that accesses the shared data. | Thread collision area. | Protect using lock locks. |
| **Intrinsic Lock** | The implicit lock attached to every Java object. | Threads overwriting each other's progress. | Acquired via `synchronized`. |

---
