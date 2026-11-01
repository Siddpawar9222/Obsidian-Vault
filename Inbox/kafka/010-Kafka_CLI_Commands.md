# 010. Essential Kafka CLI Operations & Administration

> [!abstract] Learning Goal
> Master the essential Kafka command-line scripts: creating, describing, and altering topics, publishing messages with keys from the terminal, consuming records from offsets, and formatting KRaft storage.

---

## 🧭 Navigation
- **Previous Note:** [[009-End_to_End_Industrial_Example.md|← 009. End-to-End Industrial Example]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[011-Quick_Revision_and_Interview_Guide.md|011. Quick Revision & Interview Guide →]]

---

## 1. Topic Management (`kafka-topics.sh`)

### 1. Create a Topic
Create a topic named `orders` with 3 partitions and a replication factor of 1 (for local single-broker testing):

```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic orders \
  --partitions 3 \
  --replication-factor 1
```

For production on a 3-broker cluster with high availability:
```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic orders \
  --partitions 6 \
  --replication-factor 3
```

---

### 2. Describe a Topic (Inspect Partitions, Leaders & ISR)
This is the most important troubleshooting command:

```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --describe \
  --topic orders
```

**Sample Output:**
```text
Topic: orders   TopicId: 9vR...   PartitionCount: 3   ReplicationFactor: 3   Configs:
  Topic: orders   Partition: 0   Leader: 1   Replicas: 1,2,3   Isr: 1,2,3
  Topic: orders   Partition: 1   Leader: 2   Replicas: 2,3,1   Isr: 2,3,1
  Topic: orders   Partition: 2   Leader: 3   Replicas: 3,1,2   Isr: 3,1,2
```
- **Leader:** The broker currently handling writes/reads for this partition.
- **Replicas:** All brokers configured to store a copy.
- **Isr:** Replicas that are currently synchronized and eligible for leader election.

---

### 3. List All Topics
```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --list
```

---

### 4. Increase Partition Count
```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --alter \
  --topic orders \
  --partitions 6
```
> [!warning] Partition Decreases Are Forbidden
> You can **never decrease** the number of partitions in a topic because deleting partitions would destroy existing committed message logs.

---

## 2. Publishing Messages (`kafka-console-producer.sh`)

### 1. Simple Producer (Value Only, No Key)
```bash
kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders
```
*Type messages and press Enter:*
```text
> Order 1 created
> Order 2 created
```

---

### 2. Producer with Keys (Key-Based Routing)
To test key-based partitioning from the console, specify a key delimiter (e.g. `:`):

```bash
kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --property "parse.key=true" \
  --property "key.separator=:"
```
*Send messages with `Key:Value`:*
```text
> ORD-101:{"amount": 1000, "status": "CREATED"}
> ORD-102:{"amount": 2500, "status": "CREATED"}
> ORD-101:{"amount": 1000, "status": "PAID"}
```
*(Notice that all `ORD-101` messages will route to the exact same partition!)*

---

## 3. Consuming Messages (`kafka-console-consumer.sh`)

### 1. Consume from Beginning
```bash
kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --from-beginning
```

---

### 2. Print Keys, Partitions, and Offsets (Debugging)
To see full metadata while consuming:

```bash
kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --from-beginning \
  --property print.key=true \
  --property print.value=true \
  --property print.partition=true \
  --property print.offset=true
```

**Sample Output:**
```text
Partition:1 Offset:0  Key:ORD-101  Value:{"amount": 1000, "status": "CREATED"}
Partition:2 Offset:0  Key:ORD-102  Value:{"amount": 2500, "status": "CREATED"}
Partition:1 Offset:1  Key:ORD-101  Value:{"amount": 1000, "status": "PAID"}
```

---

### 3. Consume as Part of a Consumer Group
```bash
kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --group inventory-group
```

---

## 4. KRaft Cluster Initialization Commands

```bash
# 1. Generate unique cluster UUID
bin/kafka-storage.sh random-uuid

# 2. Format storage directories for KRaft
bin/kafka-storage.sh format \
  -t <CLUSTER_ID> \
  -c config/kraft/server.properties

# 3. Start Kafka broker/controller
bin/kafka-server-start.sh config/kraft/server.properties
```

---

## 5. Windows Batch Command Equivalents (`.bat`)

If running Kafka on native Windows Command Prompt or PowerShell:

```cmd
# Create topic
bin\windows\kafka-topics.bat --create --topic orders --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3

# Produce
bin\windows\kafka-console-producer.bat --bootstrap-server localhost:9092 --topic orders

# Consume
bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic orders --from-beginning
```

---

## 🧭 Navigation
- **Previous Note:** [[009-End_to_End_Industrial_Example.md|← 009. End-to-End Industrial Example]]
- **Syllabus:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]
- **Next Note:** [[011-Quick_Revision_and_Interview_Guide.md|011. Quick Revision & Interview Guide →]]

