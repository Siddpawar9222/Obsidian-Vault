# 011. Quick Revision Sheet & Interview Self-Assessment

---

## 1. High-Yield Revision Matrix

| Question | Concise Answer | Deep-Dive Reference |
|---|---|---|
| **What is Apache Kafka?** | A distributed event-streaming platform using an append-only commit log. | [[001-Introduction_and_Problem_Statement.md]] |
| **Why is Kafka better than direct REST?** | Decouples services, handles consumer downtime without data loss, and enables async non-blocking execution. | [[001-Introduction_and_Problem_Statement.md]] |
| **What is a Topic?** | A logical named stream/category where related records are published. | [[004-Topics_and_Partitions.md]] |
| **What is a Partition?** | An ordered, immutable sequence of records; Kafka's fundamental unit of parallelism. | [[004-Topics_and_Partitions.md]] |
| **What is an Offset?** | An integer index identifying a record's position within a specific partition. | [[002-Core_Terminologies.md]] |
| **Why is Kafka so fast on disk?** | Sequential I/O, Linux OS Page Cache, Zero-Copy (`sendfile`), and batch compression. | [[003-Kafka_Architecture_and_Internals.md]] |
| **Why does Kafka use a Pull model?** | Gives consumers flow control so fast brokers don't overwhelm slow consumers, and enables massive batching. | [[003-Kafka_Architecture_and_Internals.md]] |
| **How does Kafka route messages with a Key?** | Computes `Murmur2(key) % partitionCount` to deterministically land the same key on the same partition. | [[005-Producer_Partitioning_and_Ordering.md]] |
| **How does Kafka route without a Key?** | Uses the Sticky Partitioner to batch records into one partition until full, then advances. | [[005-Producer_Partitioning_and_Ordering.md]] |
| **Does Kafka guarantee global order?** | **No.** Ordering is strictly guaranteed only within a single partition. | [[005-Producer_Partitioning_and_Ordering.md]] |
| **What is a Consumer Group?** | A collection of consumers cooperating to consume a topic; each partition is read by at most 1 consumer. | [[006-Consumers_and_Consumer_Groups.md]] |
| **What happens if consumers > partitions?** | The extra consumer instances sit completely idle with no partition assigned. | [[006-Consumers_and_Consumer_Groups.md]] |
| **What is a Partition Leader?** | The single replica that handles all normal read and write operations. | [[007-Replication_and_Fault_Tolerance.md]] |
| **What is a Follower Replica?** | A passive backup replica that pulls data from the leader to stay synchronized. | [[007-Replication_and_Fault_Tolerance.md]] |
| **What is the ISR (In-Sync Replicas)?** | Replicas actively caught up with the leader within `replica.lag.time.max.ms`; eligible for leader election. | [[007-Replication_and_Fault_Tolerance.md]] |
| **What is KRaft?** | Built-in Raft consensus engine managing metadata directly inside Kafka, removing ZooKeeper. | [[008-KRaft_and_Cluster_Consensus.md]] |
| **What is the Raft Quorum rule?** | Requires a strict majority $\lfloor N/2 \rfloor + 1$; always use an odd number (3 or 5 controllers). | [[008-KRaft_and_Cluster_Consensus.md]] |
| **Combined vs Dedicated Mode?** | Combined shares processes (Dev/Test); Dedicated isolates controllers from brokers (Production). | [[008-KRaft_and_Cluster_Consensus.md]] |

---

## 2. Five Critical Pitfalls You Must Never Confuse

### 1. Topic vs Partition
- **Topic:** The logical category name (e.g. `orders`).
- **Partition:** The physical append-only log file on disk (e.g. `orders-0`, `orders-1`).

### 2. Partition vs Broker
- **Partition:** A log data structure storing records.
- **Broker:** The physical/virtual server running the Kafka process that hosts partition replicas.

### 3. Partitioning vs Replication
- **Partitioning:** Divides data for **parallelism and horizontal scale**.
- **Replication:** Copies data for **high availability and fault tolerance**.

### 4. Key vs Offset
- **Key:** Business identifier (`orderId`, `accountId`) chosen by the developer to control partition routing.
- **Offset:** Internal sequential index (`0, 1, 2...`) assigned by Kafka to track consumer progress.

### 5. Leader vs Follower
- **Leader:** Handles all client writes and reads.
- **Follower:** Passively copies from the leader; never takes direct client writes.

---

## 3. Interview Self-Assessment Checklist

Test your readiness before an interview or system design review:

- [ ] Can you explain why synchronous REST calls cause cascading failures in microservices?
- [ ] Why does sequential disk access in Kafka outperform random memory access?
- [ ] How does Zero-Copy (`sendfile`) eliminate context switching between kernel space and user space?
- [ ] If a topic has 4 partitions and a consumer group has 6 instances, how many instances will receive messages?
- [ ] If you need strict per-customer transaction ordering, what partition key do you choose and why?
- [ ] What happens to key-based partition distribution if you increase partition count from 3 to 6 on a live topic?
- [ ] How does a consumer resume reading from the correct position after a crash?
- [ ] What is an In-Sync Replica (ISR) and why is it dangerous to elect an out-of-sync replica as leader?
- [ ] What are the two fault tolerance mechanisms in Kafka (Data vs Metadata)?
- [ ] Why did Kafka remove ZooKeeper in favor of KRaft?
- [ ] What is the difference between KRaft Combined Mode and Dedicated Mode?
- [ ] Why must you always use an odd number of KRaft controllers (e.g. 3 or 5)?

---

