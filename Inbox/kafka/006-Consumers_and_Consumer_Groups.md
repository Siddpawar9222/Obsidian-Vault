# 006. Consumers, Consumer Groups & Load Balancing

> [!abstract] Learning Goal
> Understand how consumers read from Kafka, how Consumer Groups distribute partitions across instances, the fundamental 1-to-1 partition assignment rule, and how multiple consumer groups independently consume the same topic.

---

## 🧭 Navigation
- **Previous Note:** [[005-Producer_Partitioning_and_Ordering.md|← 005. Producer Partitioning & Ordering]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[007-Replication_and_Fault_Tolerance.md|007. Replication, High Availability & Fault Tolerance →]]

---

## 1. Producer vs Consumer Roles

```text
+-----------------------+              +-----------------------+
|  Kafka Producer App   |              |  Kafka Consumer App   |
| (e.g. Order Service)  |              |(e.g. Inventory Service|
+-----------------------+              +-----------------------+
           |                                       ^
           | Publishes (Sends)                     | Polls (Pulls)
           v                                       |
+--------------------------------------------------------------+
|                         Kafka Topic                          |
+--------------------------------------------------------------+
```

- **Producer:** Creates records, serializes keys/values, and routes batches to partition leaders.
- **Consumer:** Polls records, deserializes byte arrays into Java objects, commits read offsets, and executes application business logic.

> [!important] The Consumer Executes the Business Action
> Consuming a message from Kafka does **NOT** automatically update your PostgreSQL or MongoDB database! Kafka's job is purely message delivery. Your Java consumer code must explicitly open a transaction, update the database, and commit the offset.

---

## 2. What Is a Consumer Group?

A **Consumer Group** is a set of consumer instances that cooperate to consume records from a topic.

All consumers sharing the same `group.id` configuration belong to the same consumer group:

```text
Topic: orders (3 Partitions)
|
+--- Partition 0
+--- Partition 1
+--- Partition 2

Consumer Group: "inventory-group"
|
+--- Consumer Instance 1  ---> Reads Partition 0
+--- Consumer Instance 2  ---> Reads Partition 1
+--- Consumer Instance 3  ---> Reads Partition 2
```

### Why Do We Need Consumer Groups?
1. **Load Balancing & Horizontal Scaling:** You can distribute high-throughput topics across multiple microservice pods.
2. **Fault Tolerance & Rebalancing:** If Consumer Instance 2 crashes, Kafka automatically detects the heartbeat failure and **rebalances** Partition 1 to Consumer 1 or Consumer 3!

---

## 3. The 1-to-1 Partition Assignment Rule

Inside a **single** consumer group:
$$\textbf{Each partition is assigned to AT MOST ONE consumer instance at any given time.}$$

Let's look at three common scenarios:

### Scenario A: Equal Partitions and Consumers (Optimal)
- Topic has **3 Partitions** (`P0`, `P1`, `P2`).
- Group has **3 Consumers** (`C1`, `C2`, `C3`).
```text
P0  -----> C1
P1  -----> C2
P2  -----> C3
```
*Result:* Perfectly balanced. Each consumer processes one partition.

### Scenario B: More Consumers than Partitions (Idle Workers!)
- Topic has **3 Partitions** (`P0`, `P1`, `P2`).
- Group has **5 Consumers** (`C1`, `C2`, `C3`, `C4`, `C5`).
```text
P0  -----> C1
P1  -----> C2
P2  -----> C3
           C4 (IDLE - Receives no messages!)
           C5 (IDLE - Receives no messages!)
```
*Result:* `C4` and `C5` sit completely idle as hot-standbys. **You cannot achieve more parallelism than the number of partitions in a topic!**

### Scenario C: Fewer Consumers than Partitions
- Topic has **3 Partitions** (`P0`, `P1`, `P2`).
- Group has **1 Consumer** (`C1`).
```text
P0  ---+
P1  ---+--> C1 (Reads all 3 partitions sequentially)
P2  ---+
```
*Result:* `C1` reads from all three partitions.

> [!tip] Sizing Rule
> If you want 10 microservice replicas to process a topic concurrently, your topic **must have at least 10 partitions**.

---

## 4. Multiple Consumer Groups on the Same Topic

What happens if multiple distinct microservices need to read the `orders` topic?

**Different consumer groups consume independently from each other!**

```text
                               Topic: orders
                                     |
             +-----------------------+-----------------------+
             |                       |                       |
             v                       v                       v
      Consumer Group:         Consumer Group:         Consumer Group:
     "inventory-group"        "payment-group"      "notification-group"
             |                       |                       |
   Consumer Instance 1     Consumer Instance 1     Consumer Instance 1
   Consumer Instance 2     Consumer Instance 2     Consumer Instance 2
```

- **Inventory Service** maintains its own committed offsets (e.g. at Offset 50).
- **Payment Service** maintains its own committed offsets (e.g. at Offset 80).
- **Notification Service** maintains its own committed offsets (e.g. at Offset 20).
- One group's reading speed, lag, or downtime **never impacts or blocks** any other group.

---

## 5. Offset Tracking and Commits

Kafka tracks the progress of each consumer group inside an internal topic named `__consumer_offsets`.

```text
__consumer_offsets records:
[Group: inventory-group, Topic: orders, Partition: 0] ---> Committed Offset: 42
```

### The Commit Cycle
1. Consumer polls a batch of records (offsets 40 to 45).
2. Consumer processes the records in business logic.
3. Consumer commits offset 45 to Kafka.
4. **On Restart:** If the consumer crashes and a new instance spins up, Kafka checks `__consumer_offsets` and starts the new consumer right from **Offset 46**!

---

## 🧭 Navigation
- **Previous Note:** [[005-Producer_Partitioning_and_Ordering.md|← 005. Producer Partitioning & Ordering]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[007-Replication_and_Fault_Tolerance.md|007. Replication, High Availability & Fault Tolerance →]]

