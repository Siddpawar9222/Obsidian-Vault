# 005. Producer Partitioning Mechanics & Message Ordering

> [!abstract] Learning Goal
> Learn how Kafka determines which partition receives a message. Master key-based routing, hashing algorithms, sticky partitioning, explicit partition assignment, and how to guarantee strict business ordering per entity.

---

## 🧭 Navigation
- **Previous Note:** [[004-Topics_and_Partitions.md|← 004. Topics, Partitions & Storage Topologies]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[006-Consumers_and_Consumer_Groups.md|006. Consumers, Consumer Groups & Load Balancing →]]

---

## 1. How Does Kafka Choose a Partition?

When your application publishes a record to a topic with multiple partitions (e.g. `P0`, `P1`, `P2`), Kafka's producer client must decide: **Which partition should receive this record?**

There are **three distinct strategies**:

```text
Producer Partitioning Strategies:
1. With Key        ===> Murmur2 Hash of Key % Total Partitions
2. Without Key     ===> Sticky Partitioner (Batches records to one partition, then rotates)
3. Explicit Target ===> Hardcoded Partition Number passed in code
```

---

## 2. Strategy 1: Key-Based Partitioning (Most Important)

When a record includes a non-null **Key**, the producer uses deterministic key hashing to select the partition:

```text
Record Key (e.g. "ACC-101")
        |
        v
Serialize Key into Bytes
        |
        v
Calculate Hash (Murmur2 Algorithm)
        |
        v
Compute: Math.abs(hash) % Number of Partitions (e.g. 3)
        |
        v
Assigned Partition (e.g. Partition 1)
```

### Deterministic Affinity
If you send three consecutive events for Bank Account `ACC-101`:
1. `Deposit ₹1,000` (Key: `ACC-101`) $\longrightarrow$ **Partition 1**
2. `Withdraw ₹200` (Key: `ACC-101`) $\longrightarrow$ **Partition 1**
3. `Deposit ₹500` (Key: `ACC-101`) $\longrightarrow$ **Partition 1**

Because the key `ACC-101` produces the exact same hash, all three events land on **Partition 1** in the exact order they were sent:

```text
Partition 1 Log:
+--------------------------+-------------------------+------------------------+
| Offset 0: Deposit ₹1,000 | Offset 1: Withdraw ₹200 | Offset 2: Deposit ₹500 |
+--------------------------+-------------------------+------------------------+
```

### What Is a Hash Function?
A hash function takes an arbitrary input string (e.g. `"ACC-101"`) and computes a fixed numeric integer.
- The same input **always** produces the exact same integer output.
- Different inputs are uniformly distributed across the integer range.
- *Note:* Kafka does **not** use a Java `HashMap` on a server; the producer client runs Murmur2 locally before sending the network request.

---

## 3. Choosing the Right Partition Key

The key you choose must match the **business entity whose event sequence you must preserve**:

| Business Requirement | Ideal Partition Key | Consequence |
|---|---|---|
| Preserve order of actions for an order | `orderId` | `OrderCreated`, `Paid`, `Shipped` land on the same partition. |
| Preserve order of bank transactions | `accountId` | Deposits and withdrawals execute in strict financial order. |
| Group all activities of a user | `userId` | User profile edits and clicks stay in sequence. |
| Track stock updates for a product | `productId` | Stock reservation events for that SKU stay ordered. |

> [!danger] Critical Caveat: Changing Partition Count Breaks Key Mapping!
> The formula is `hash % partitionCount`.
> - If partition count is **3**: `hash % 3 = 1` (Lands on P1).
> - If you later increase partitions to **6**: `hash % 6` might become `4`!
> If you add partitions to an existing topic, future events for `ACC-101` may land on Partition 4 while previous events were on Partition 1, temporarily disrupting ordering during transition!

---

## 4. Strategy 2: Partitioning Without a Key (Sticky Partitioner)

What if your record has `key = null`?

In modern Kafka (version 2.4+), the producer uses the **Uniform Sticky Partitioner**:
- Instead of cycling round-robin for every individual message (which breaks batching and causes high network overhead), the producer **sticks** to one partition until a batch is filled (or `linger.ms` expires).
- Once the batch is dispatched, it moves to the next partition.
- **Benefit:** Highly efficient network batching and reduced CPU usage, while keeping partitions evenly loaded over time.

---

## 5. Strategy 3: Explicit Partition Selection

You can bypass the partitioner completely and specify the exact partition number in your code.

### Spring Boot Producer Example (`KafkaTemplate`)

#### Option A: Routing by Key (Recommended)
```java
// Topic, Key, Payload
kafkaTemplate.send("orders", "ORD-101", "Order Created");
// Kafka hashes "ORD-101" to determine partition automatically
```

#### Option B: Specifying Explicit Partition (Advanced / Rare)
```java
// Topic, Partition Number (1), Key, Payload
kafkaTemplate.send("orders", 1, "ORD-101", "Order Created");
// Forces message directly to Partition 1
```

> [!tip] Best Practice
> Hardcoding partition numbers is generally an anti-pattern because your application code becomes tightly coupled to cluster infrastructure. Always prefer **Key-Based Routing**.

---

## 6. Message Ordering Guarantees Summary

1. **Ordering within a partition is strictly guaranteed:** Offsets are sequential and immutable.
2. **Global ordering across partitions does NOT exist:** Message at Offset 5 in P0 might have occurred before or after Offset 5 in P1.
3. **Entity ordering is solved by Keys:** If you need strict ordering per customer or per order, assign that entity ID as the Key.

---

## 🧭 Navigation
- **Previous Note:** [[004-Topics_and_Partitions.md|← 004. Topics, Partitions & Storage Topologies]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[006-Consumers_and_Consumer_Groups.md|006. Consumers, Consumer Groups & Load Balancing →]]

