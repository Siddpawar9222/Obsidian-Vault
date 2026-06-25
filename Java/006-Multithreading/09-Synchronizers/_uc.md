## 4. `Phaser`

### The Problem

You're running a **multi-stage data pipeline** — like processing end-of-day financial reports:
- Stage 1: All 5 threads fetch raw data
- Stage 2: Only after ALL threads finish fetching, all 5 threads start processing
- Stage 3: Only after ALL threads finish processing, all 5 threads start generating reports

You need threads to **wait for each other at each stage** before moving on. `CountDownLatch` can't be reused. `CyclicBarrier` has a fixed party count. `Phaser` solves both.

```java
public class ReportPipeline {

    public static void main(String[] args) {
        int threadCount = 5;
        Phaser phaser = new Phaser(threadCount); // register 5 parties

        for (int i = 0; i < threadCount; i++) {
            int threadId = i;
            new Thread(() -> {
                
                // --- Stage 1: Fetch Data ---
                System.out.println("Thread " + threadId + " fetching data...");
                fetchData(threadId);
                phaser.arriveAndAwaitAdvance(); // wait for all threads to finish fetching
                // No thread moves past here until ALL 5 have arrived

                // --- Stage 2: Process Data ---
                System.out.println("Thread " + threadId + " processing...");
                processData(threadId);
                phaser.arriveAndAwaitAdvance(); // wait for all to finish processing

                // --- Stage 3: Generate Report ---
                System.out.println("Thread " + threadId + " generating report...");
                generateReport(threadId);
                phaser.arriveAndDeregister(); // done, deregister from phaser

            }).start();
        }
    }
}
```

### Dynamic party registration — the killer feature

Unlike `CyclicBarrier` where party count is fixed, `Phaser` allows threads to **join and leave dynamically**:

```java
Phaser phaser = new Phaser(1); // start with 1 (main thread)

for (int i = 0; i < dynamicThreadCount; i++) {
    phaser.register(); // dynamically add a new party
    new Thread(() -> {
        doWork();
        phaser.arriveAndDeregister(); // leave when done
    }).start();
}

phaser.arriveAndDeregister(); // main thread leaves
```

This is perfect for batch jobs where the number of workers isn't known upfront.
