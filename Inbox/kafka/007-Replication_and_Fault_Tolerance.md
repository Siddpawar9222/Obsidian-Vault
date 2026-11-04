# 007. Replication, High Availability & Fault Tolerance

---

## 1. Partitioning vs Replication

Engineers frequently confuse partitioning with replication. They solve two fundamentally different problems:

```text
+------------------------------------------------------------------------+
|  PARTITIONING: Divides data into shards for parallel processing.       |
|  REPLICATION:  Copies shards across multiple servers for redundancy.   |
+------------------------------------------------------------------------+
```

Imagine 3 partitions on 3 brokers **without replication**:
```text
Broker 1  ---> Partition 0
Broker 2  ---> Partition 1
Broker 3  ---> Partition 2
```
If Broker 1 crashes, **Partition 0 is completely offline and unreachable**. Data is unavailable until Broker 1 is physically repaired.

To solve this, Kafka uses **Replication**.

---

## 2. What Is a Replica?

A **Replica** is a duplicate copy of a partition log hosted on a different broker in the cluster.

For Partition 0 with a Replication Factor of 3:
- Copy 1 lives on **Broker 1**
- Copy 2 lives on **Broker 2**
- Copy 3 lives on **Broker 3**

These are not three different partitions; they are **three physical copies of the same logical partition**.

---

## 3. Leader and Follower Roles

Every replica in Kafka is assigned a specific role:

```text
                            Partition 0
                   +---------------------------+
                   | Broker 1: Leader Replica  | <=== Handles ALL writes & reads
                   +---------------------------+
                     |                       |
                     | Replicates log        | Replicates log
                     v                       v
        +-------------------------+     +-------------------------+
        | Broker 2: Follower      |     | Broker 3: Follower      |
        +-------------------------+     +-------------------------+
```

### 1. Leader Replica
- Handles **all write operations** from producers.
- Handles **all read operations** from consumers (by default).
- Sequences records and assigns offsets.

### 2. Follower Replicas
- Do **not** handle client writes.
- Actively pull records from the Leader over the network to synchronize their local logs.
- Stand by as hot backups ready to take over leadership immediately if the leader dies.

---

## 4. Automatic Leader Failover Walkthrough

What happens when the broker hosting a partition leader crashes?

```text
Step 1: Normal State
Broker 1: P0 Leader (Active)
Broker 2: P0 Follower (In-Sync)
Broker 3: P0 Follower (In-Sync)

Step 2: Broker 1 Server Hard Crash!
Broker 1 goes offline. Leader heartbeat is lost.

Step 3: Automatic Leader Election
Kafka Controller elects Broker 2 (an eligible in-sync follower) as the NEW LEADER for P0.

Step 4: Self-Healing Cluster
Broker 2: P0 Leader (Now active and accepting writes/reads)
Broker 3: P0 Follower (Now replicating from Broker 2)
```

Producers and consumers experience a momentary blip (a few hundred milliseconds) while metadata refreshes, and then resume normal operations without data loss!

---

## 5. Replication Factor (RF)

The **Replication Factor** configures how many total copies of each partition exist across the cluster.

### Common Configurations:
- **`RF = 1` (Learning / Local Dev Only):**
  - Only 1 copy of the data exists.
  - If that broker crashes, data is unavailable and risk of permanent data loss is high.
- **`RF = 2` (Minimum redundancy):**
  - 1 Leader + 1 Follower. Can tolerate **1 broker failure**.
- **`RF = 3` (Enterprise Production Standard):**
  - 1 Leader + 2 Followers. Can tolerate **up to 2 broker failures** without data loss.

### Calculating Total Replicas in a Cluster:
$$\text{Total Partition Replicas} = \text{Topic Partitions} \times \text{Replication Factor}$$

*Example:* A topic with 3 partitions and Replication Factor 3:
$$3 \text{ partitions} \times 3 \text{ replicas} = 9 \text{ physical replica instances}$$

> [!important] Broker Count Requirement
> You **cannot** set a replication factor higher than the number of active brokers in your cluster. If you have 3 brokers, maximum RF is 3. Kafka will never place two replicas of the same partition on the same broker (that would defeat redundancy).

---

## 6. ISR (In-Sync Replicas)

**ISR** stands for **In-Sync Replicas**. It is the subset of all partition replicas that are actively caught up with the partition leader.

```text
Partition 0 (RF = 3):
- Broker 1 (Leader):   Offset 100  [In ISR]
- Broker 2 (Follower): Offset 100  [In ISR]
- Broker 3 (Follower): Offset 30   [OUT OF ISR - Slow network or lagging!]

Current ISR Set = {Broker 1, Broker 2}
```

### When Is a Replica Dropped from ISR?
If a follower fails to send fetch requests to the leader within `replica.lag.time.max.ms` (default 30 seconds), the leader removes that follower from the ISR set.

### Why ISR Matters for Data Safety:
1. **Zero Data Loss Leader Election:** When a leader crashes, Kafka strictly elects a new leader **only from the ISR set**.
2. **Producer Acks (`acks=all`):** When a producer sends data with `acks=all`, the write is considered committed only when **all replicas in the ISR set** have written the record to their logs.

---

## 7. Dual Fault Tolerance: Data vs Metadata

A resilient Kafka cluster has **two separate fault-tolerance mechanisms**:

```text
                                Kafka Fault Tolerance
                                          |
                   +----------------------+----------------------+
                   |                                             |
                   v                                             v
       Data Fault Tolerance                           Metadata Fault Tolerance
    (Partition Replicas & ISR)                       (KRaft Controller Quorum)
                   |                                             |
  Protects your business messages               Protects cluster information
  (Topic records, offsets, payloads)            (Topic list, broker IDs, ACLs)
                   |                                             |
  Handled by: Partition Leader/Followers        Handled by: KRaft Quorum Voters
```

- **Data Fault Tolerance:** Partition replication protects your actual messages against broker crashes.
- **Metadata Fault Tolerance:** The KRaft Controller Quorum protects cluster state, metadata, and partition leadership information.

---

