# 004. Topics, Partitions & Storage Topologies
---

## 1. What Is a Kafka Topic?

A **Topic** is a named, logical stream or channel where Kafka organizes and stores related records.

### Typical Topic Examples
```text
orders
payments
customer-events
notifications
inventory-updates
```

Suppose your Order Service publishes events: `OrderCreated`, `OrderPaid`, `OrderShipped`, `OrderCancelled`. All these business events are published to the `orders` topic.

### Key Rules of Topics
- **Logical abstraction:** A topic is a logical name, not a single physical file or single machine.
- **Multi-producer & Multi-consumer:** Multiple producer services can publish to one topic, and multiple independent consumer groups can read from it simultaneously.
- **Retention Policy:** Records in a topic are not deleted when read. They remain available until their retention period expires (e.g. 7 days) or a size limit is reached.
- **A topic contains partitions:** To achieve high throughput, a topic is split into one or more **partitions**.

---

## 2. What Is a Kafka Partition?

A **Partition** is a single, append-only, ordered log file inside a topic.

Suppose the `orders` topic is configured with **3 partitions**:

```text
Topic: orders
|
+-- Partition 0:  [Offset 0: Order A] -> [Offset 1: Order D] -> [Offset 2: Order G]
|
+-- Partition 1:  [Offset 0: Order B] -> [Offset 1: Order E] -> [Offset 2: Order H]
|
+-- Partition 2:  [Offset 0: Order C] -> [Offset 1: Order F] -> [Offset 2: Order I]
```

### Why Do We Need Partitions?
Imagine your application produces **1,000,000 order events per hour**.

1. **If a topic has only 1 partition:**
   - All records are written to a single file on a single disk.
   - Only **one** consumer instance in a consumer group can read from that topic at a time.
   - Concurrency is completely blocked.
2. **If a topic has 3 partitions:**
   - Records are distributed across all three partitions.
   - **Three independent consumers** can read partitions 0, 1, and 2 in parallel!
   - Processing throughput triples.

### Benefits of Partitioning
- **Horizontal Scalability:** Partition replicas can be distributed across different physical brokers and disks.
- **Parallel Processing:** Partitions define the maximum degree of consumer parallelism in a consumer group.
- **Distributed Storage:** A topic that holds 10 Terabytes can be split across 10 brokers holding 1 Terabyte each.
- **Deterministic Ordering:** Each partition strictly preserves the order of its own records.

> [!important] Crucial Ordering Limitation
> Kafka guarantees strict message ordering **ONLY within a single partition**. Kafka does **NOT** guarantee global ordering across different partitions in the same topic.

---

## 3. What Is a Kafka Broker?

A **Broker** is a running Kafka server process that manages partitions, stores segment files on disk, and responds to client read/write requests.

```text
Broker 1 (Node ID: 1)  ---> localhost:9092
Broker 2 (Node ID: 2)  ---> localhost:9093
Broker 3 (Node ID: 3)  ---> localhost:9094
```

### Responsibilities of a Broker
1. Receives write requests from producers and appends them to partition logs.
2. Serves fetch requests from consumers.
3. Replicates partition data to follower brokers.
4. Participates in cluster metadata coordination.

> [!warning] Broker $\neq$ Partition
> A broker is a **server process / machine**. A partition is a **log data structure**. One broker typically hosts hundreds of partition replicas across different topics.

---

## 4. What Is a Kafka Cluster?

A **Kafka Cluster** is a group of multiple brokers working together under shared coordination.

```text
                             Kafka Cluster
        +-----------------------------------------------------+
        |                                                     |
        |   Broker 1              Broker 2         Broker 3   |
        |   +---------------+     +--------------+ +--------+ |
        |   | Topic orders: |     |Topic orders: | | orders:| |
        |   |   P0 Leader   |     |  P1 Leader   | |P2 Ldr  | |
        |   |   P1 Follower |     |  P0 Follower | |P0 Fol  | |
        |   +---------------+     +--------------+ +--------+ |
        +-----------------------------------------------------+
```

### Why Use a Multi-Broker Cluster?
- **Aggregated Storage & Network:** Distribute millions of IOPS and terabytes of data across multiple servers.
- **Leader Load Balancing:** Partition leaders are balanced across all brokers so no single broker takes all write traffic.
- **High Availability & Fault Tolerance:** If Broker 1 crashes, Brokers 2 and 3 continue serving traffic without data loss.

---

## 5. Single Server vs Multiple Servers (Topologies)

Understanding the difference between data distribution and redundancy:

### Scenario A: Three Partitions on a Single Broker

```text
+--------------------------------------------------+
|               Broker 1 (One Server)              |
|                                                  |
|   orders - Partition 0                           |
|   orders - Partition 1                           |
|   orders - Partition 2                           |
+--------------------------------------------------+
```
- **Concurrency:** You can still have 3 consumer instances reading partitions concurrently.
- **Resource Contention:** All three partitions share the same CPU, disk I/O, and network bandwidth of Server 1.
- **Zero Redundancy:** If Server 1 dies, the **entire cluster and all 3 partitions are offline**.

### Scenario B: Three Partitions Across Three Brokers (Without Replication)

```text
+-------------------+   +-------------------+   +-------------------+
|     Broker 1      |   |     Broker 2      |   |     Broker 3      |
|                   |   |                   |   |                   |
| orders-Partition 0|   | orders-Partition 1|   | orders-Partition 2|
+-------------------+   +-------------------+   +-------------------+
```
- **Resource Distribution:** CPU, disk, and network load are split across 3 distinct machines.
- **Still No Fault Tolerance:** If Broker 1 fails, **Partition 0 is completely unavailable** until Broker 1 recovers.

> [!tip] The Golden Rule of Topologies
> - **Partitioning** divides data for concurrency and distributed storage.
> - **Brokers** host the physical data.
> - **Replication** (covered in Note 007) copies the data to guarantee high availability!

---
