
---

# Complete Thread Lifecycle

```text
                 new Thread()
                      │
                      ▼
                 NEW (Created)
                      │
               start() called
                      │
                      ▼
        RUNNABLE (Ready + Running)
          ▲      ▲        │
          │      │        │
          │      │        │sleep()
          │      │        │join()
          │      │        │wait()
          │      │        │park()
          │      │        │waiting for lock
          │      │        ▼
          │      └──── BLOCKED /
          │           WAITING /
          │      TIMED_WAITING
          │              │
          └──────────────┘
          event completed

                      │
             run() finishes
                      ▼
              TERMINATED
```

---

# State 1 : NEW

This is the first state.

Example

```java
Thread t = new Thread(() -> {
    System.out.println("Hello");
});
```

Current state

```
NEW
```

The thread object exists.

But JVM has **not started** it.
```

The thread has

- memory
    
- stack
    

But CPU is not executing it.

---

# State 2 : RUNNABLE

Now

```java
t.start();
```

is called.

Now JVM tells Operating System

```
I have one thread.

Please schedule it.
```

The thread enters

```
RUNNABLE
```

Many beginners think RUNNABLE means

```
CPU is executing it.
```

Actually No.

RUNNABLE means

```
Ready to run
OR
Currently running
```

Java combines both.

---

## Example

Suppose CPU has only one core.

Three threads

```
T1
T2
T3
```

After calling

```java
start();
```

All become

```
RUNNABLE
```

Only one gets CPU.

```
CPU

Running

T2
```

Remaining

```
T1

T3
```

are waiting for CPU.

Still their Java state is

```
RUNNABLE
```

Because Java doesn't distinguish

- Ready
    
- Running
    

---

# State 3 : BLOCKED

This happens when a thread wants a synchronized lock.

Example

```java
synchronized(lock) {

}
```

Suppose

```
Thread A
```

already owns lock.

Now

```
Thread B
```

tries

```java
synchronized(lock)
```

Result

```
BLOCKED
```
---

# State 4 : WAITING

This is different from BLOCKED.

Here thread waits for another event.

Example

```java
thread.join();
```

or

```java
wait();
```

Example

```
Main Thread

waits for

Worker Thread
```

Main thread becomes

```
WAITING
```
---

# State 5 : TIMED_WAITING

Same as waiting

But only for limited time.

Example

```java
Thread.sleep(5000);
```

or

```java
join(3000);
```

or

```java
wait(1000);
```

The thread sleeps.

After timeout

it automatically returns to

```
RUNNABLE
```
---

# State 6 : TERMINATED

When

```java
run()
```

finishes

the thread dies.

Example

```java
public void run() {
    System.out.println("Done");
}
```

After execution

```
TERMINATED
```

It can never run again.

This is illegal

```java
t.start();
t.start();
```

Output

```
IllegalThreadStateException
```

Because dead thread cannot restart.

---

# Real Execution Flow

Example

```java
Thread t = new Thread(() -> {

    Thread.sleep(3000);

    synchronized(lock) {

        System.out.println("Working");

    }

});
```

Flow

```
Create thread
      │
      ▼
NEW

start()

      ▼
RUNNABLE

CPU starts executing

      ▼
TIMED_WAITING
(Thread.sleep)

3 seconds over

      ▼
RUNNABLE

Needs lock

If unavailable

      ▼
BLOCKED

Gets lock

      ▼
RUNNABLE

run() completes

      ▼
TERMINATED
```

---

# Industry Example (Spring Boot)

Imagine an HTTP request comes into a Spring Boot application.

```
Client

   │
   ▼

Tomcat Thread Pool

Thread-17
```

Lifecycle

```
Thread created earlier

↓

RUNNABLE

↓

Controller

↓

Service

↓

Repository

↓

DB Query
```

Suppose DB takes 2 seconds.

The thread is waiting for the database response. From the Java thread-state perspective, it is typically in a waiting/timed-waiting state because it is blocked inside I/O operations handled by the JVM/OS.

```
↓

DB response received

↓

RUNNABLE

↓

Returns HTTP Response

↓

Ready to serve next request
```

Notice something important:

The thread **does not terminate after every request** in a server like Tomcat. Threads belong to a thread pool, so after finishing one request they go back to the pool and become available to handle another request. Only when the application shuts down or the pool removes a thread does it reach the `TERMINATED` state.

---

# Summary Table

| State             | What it means                                    | Example                                     |
| ----------------- | ------------------------------------------------ | ------------------------------------------- |
| **NEW**           | Thread object created but not started            | `new Thread()`                              |
| **RUNNABLE**      | Ready to run or currently running on the CPU     | `start()`                                   |
| **BLOCKED**       | Waiting to acquire a `synchronized` lock         | Waiting for a monitor lock                  |
| **WAITING**       | Waiting indefinitely for another thread or event | `join()`, `wait()`                          |
| **TIMED_WAITING** | Waiting for a specified amount of time           | `sleep()`, `join(timeout)`, `wait(timeout)` |
| **TERMINATED**    | `run()` method has finished                      | Thread execution completed                  |

---

## A key point to remember

The lifecycle is **not a straight line**. A thread can move between `RUNNABLE` and various waiting states many times during its life:

```text
NEW
 │
 ▼
RUNNABLE
 │
 ├────────► BLOCKED ───────┐
 │                         │
 ├────────► WAITING ───────┤
 │                         │
 └────────► TIMED_WAITING ─┘
            │
            ▼
        RUNNABLE
            │
            ▼
      TERMINATED
```

A thread may alternate between **RUNNABLE**, **BLOCKED**, **WAITING**, and **TIMED_WAITING** repeatedly until its `run()` method completes, after which it enters **TERMINATED** permanently.

---
