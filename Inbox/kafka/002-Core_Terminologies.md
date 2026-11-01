# 002. Core Terminologies & Data Model

> [!abstract] Learning Goal
> Master the essential vocabulary of Apache Kafka and understand the data model: Records, Keys, Values, Offsets, and partition-level offset tracking.

---

## 🧭 Navigation
- **Previous Note:** [[001-Introduction_and_Problem_Statement.md|← 001. Introduction & Problem Statement]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[003-Kafka_Architecture_and_Internals.md|003. Kafka Architecture & Internal Mechanics →]]

---

## 1. Important Kafka Terminologies

| Terminology | Meaning in Simple English | Real-world Analogy |
|---|---|---|
| **Event** | An immutable fact that something occurred in the business domain | "Customer placed order ORD-101" |
| **Record / Message** | A unit of data published to Kafka (Key + Value + Metadata) | A single letter or parcel |
| **Topic** | A named category or feed where records are stored | A file folder or a database table name |
| **Partition** | An ordered, append-only log sequence within a topic | A ledger book or table shard |
| **Offset** | A sequential integer assigned to each record in a partition | A page number or bookmark |
| **Broker** | A running Kafka server instance | A post office building / node |
| **Cluster** | Multiple Kafka brokers cooperating as a single distributed system | The complete postal network |
| **Producer** | Application that creates and publishes records to topics | The sender |
| **Consumer** | Application that reads and processes records from topics | The recipient / processor |
| **Consumer Group** | A collection of consumers sharing the work of reading a topic | A team of workers sharing parcel processing |
| **Key** | Optional value in a record used for routing and grouping | Order ID, Account ID, or Customer ID |
| **Value** | The actual payload data of the event | The body of the message (JSON, Avro, Protobuf) |
| **Replica** | A copy of a partition stored on a different broker | A duplicate backup copy of a ledger |
| **Leader** | The single replica handling normal reads and writes for a partition | The active manager on duty |
| **Follower** | A replica that copies data from the leader to stay synchronized | The standby assistant copying records |
| **Replication Factor (RF)** | Total number of copies maintained for each partition | 3 means 1 leader + 2 followers |
| **ISR (In-Sync Replicas)** | Set of replicas actively caught up with the leader | Up-to-date followers ready for failover |
| **Retention Policy** | Configuration defining how long Kafka stores records (time or size) | "Keep records for 7 days or 100 GB" |
| **Controller** | Broker elected to manage cluster metadata and broker failures | Cluster supervisor / coordinator |
| **KRaft** | Kafka's built-in Raft consensus engine (replaces ZooKeeper) | Internal decentralized consensus |

---

## 2. What Is a Kafka Record?

A **Record** (also called a Message) is the basic atomic unit of data in Kafka.

### Structure of a Record
A Kafka record consists of:
- **Key (Optional):** Used for partition routing and entity grouping.
- **Value (Required):** The actual event payload.
- **Timestamp:** The time record was created or appended.
- **Headers (Optional):** Key-value pairs for metadata (tracing IDs, schema versions, auth tokens).
- **Offset:** Assigned automatically by the broker upon insertion.

### Example Record (JSON Representation)
```json
{
  "key": "ORD-101",
  "value": {
    "orderId": "ORD-101",
    "customerId": "CUST-999",
    "amount": 2500,
    "currency": "INR",
    "items": ["Item-1", "Item-2"],
    "createdAt": "2026-11-01T14:00:00Z"
  },
  "headers": {
    "traceId": "x-trace-abc-123",
    "schemaVersion": "1.0"
  }
}
```

> [!note] Serialization
> In real applications, the Key and Value are serialized into raw byte arrays (`byte[]`) before transmission across the network. Serializers (StringSerializer, JsonSerializer, AvroSerializer) convert Java objects into bytes.

### Key vs Value Role
- **Key:** Helps identify or group related events and controls **which partition** receives the record.
- **Value:** Contains the actual business data consumed by worker applications.

---

## 3. What Is an Offset?

An **Offset** is a monotonically increasing integer that identifies the exact position of a record within a specific partition.

```text
Partition 0 Log:
+----------+----------+----------+----------+----------+
| Offset 0 | Offset 1 | Offset 2 | Offset 3 | Offset 4 | ...
| Created  | Paid     | Packed   | Shipped  | Delivered|
+----------+----------+----------+----------+----------+
```

### Critical Rules About Offsets
1. **Offsets are per-partition, NOT global:**
   - Partition 0 has Offset 0, 1, 2, 3...
   - Partition 1 also has Offset 0, 1, 2, 3...
   - A message is uniquely identified in a cluster by: `(Topic, Partition, Offset)`.
2. **Offsets are immutable:** Once written, an offset never changes.
3. **Consumers track progress using offsets:**
   - Consumers read records and periodically **commit** the offset they have processed (e.g. "I have processed up to offset 99").
   - When a consumer restarts after a crash, it asks Kafka: *"Where did I leave off?"* and resumes from offset 100.
4. **An offset is NOT a business ID:** It is not an order ID or account ID; it is simply Kafka's physical log line index.

---

## 🧭 Navigation
- **Previous Note:** [[001-Introduction_and_Problem_Statement.md|← 001. Introduction & Problem Statement]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[003-Kafka_Architecture_and_Internals.md|003. Kafka Architecture & Internal Mechanics →]]

