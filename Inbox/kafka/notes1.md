# Apache Kafka — Complete Beginner-to-Industry Notes

> [!abstract] Learning Goal
> Understand Kafka from the basics: why it exists, how messages flow, what topics and partitions are, how brokers and clusters work, how partitioning selects a destination, how consumers process messages, and how replication provides fault tolerance.

---

## Table of Contents

- [[#What Is Apache Kafka?]]
- [[#Why Do We Need Kafka?]]
- [[#Important Kafka Terminologies]]
- [[#Kafka Architecture]]
- [[#What Is a Kafka Topic?]]
- [[#What Is a Kafka Partition?]]
- [[#How Does Kafka Choose a Partition?]]
- [[#What Is a Kafka Broker?]]
- [[#What Is a Kafka Cluster?]]
- [[#Single Server vs Multiple Servers]]
- [[#What Is a Kafka Record?]]
- [[#What Is an Offset?]]
- [[#Producer and Consumer]]
- [[#Consumer Groups]]
- [[#Message Ordering]]
- [[#Replication — Why Do We Need It?]]
- [[#Leader and Follower]]
- [[#Replication Factor]]
- [[#Fault Tolerance]]
- [[#ZooKeeper vs KRaft]]
- [[#End-to-End Industrial Example]]
- [[#Important Kafka Commands]]
- [[#Quick Revision]]
- [[#Practice Questions]]

---

## What Is Apache Kafka?

Apache Kafka is a distributed event-streaming platform used to transfer, store, and process streams of events between applications.

In simple English, Kafka acts as a communication system between different services.

### Real-world example

Imagine an e-commerce application built using Spring Boot microservices.

When a customer places an order:

1. The Order Service creates an order.
2. It publishes an event to Kafka.
3. The Inventory Service reads the event and updates stock.
4. The Payment Service reads the event and processes payment.
5. The Notification Service sends an order confirmation.

These services can communicate through Kafka without directly calling one another for every event.

### Architecture

```text
                 E-commerce Application

                    Order Service
                    Spring Boot
                         |
                         | Publishes event
                         v
                  +--------------+
                  |    Kafka     |
                  |  orders      |
                  |    topic     |
                  +--------------+
                    /     |     \
                   /      |      \
                  v       v       v
             Inventory  Payment  Notification
              Service   Service    Service
```

### Why is Kafka useful?

- **Loose coupling:** Services do not need direct knowledge of every receiving service.
- **Scalability:** You can add consumers and partitions to increase processing capacity.
- **Durability:** Kafka stores records on disk according to its retention configuration.
- **Fault tolerance:** Replicas can allow processing to continue when a broker fails.
- **Asynchronous processing:** The Order Service can publish an event without waiting for every downstream service to finish processing it.

> [!note] Important
> Kafka does not automatically execute business logic. Your producer creates and publishes events, and your consumer application processes them.

---

## Why Do We Need Kafka?

Consider two Spring Boot microservices.

Without Kafka:

```text
Order Service
     |
     | HTTP request
     v
Inventory Service
```

The Order Service directly calls the Inventory Service.

If the Inventory Service is temporarily unavailable, the Order Service must handle the failure, retry the request, or use another recovery mechanism.

With Kafka:

```text
Order Service
     |
     | Publishes OrderCreated event
     v
    Kafka
     |
     | Consumer reads event
     v
Inventory Service
```

Kafka can retain the event while the Inventory Service is temporarily unavailable, subject to the topic's retention policy and available storage. The consumer can process it when it becomes available again.

Kafka does not remove the need for error handling, retries, idempotency, or monitoring.

### Common industry use cases

- Order processing
- Payment events
- Inventory updates
- Log collection and monitoring
- User activity tracking
- Data synchronization between services
- Real-time analytics
- Event-driven microservices

---

## Important Kafka Terminologies

| Terminology | Meaning in simple English |
|---|---|
| Event | Something that happened, such as an order being created |
| Record / Message | A unit of data published to Kafka |
| Topic | A named category of records |
| Partition | An ordered log within a topic |
| Broker | A running Kafka server |
| Cluster | Multiple Kafka brokers working together |
| Producer | Application that publishes records |
| Consumer | Application that reads records |
| Consumer Group | Consumers sharing the work of reading a topic |
| Offset | Position of a record within a partition |
| Key | Value used to group related records and help select a partition |
| Value | The actual event data |
| Replica | A copy of a partition |
| Leader | Replica that handles normal reads and writes for its partition |
| Follower | Replica that copies data from the leader |
| Replication Factor | Number of copies configured for each partition |
| ISR | In-Sync Replicas; replicas sufficiently caught up with the leader |
| Retention | How long Kafka keeps records, or how much data it retains, according to policy |
| Controller | Kafka component responsible for cluster metadata and administrative coordination |
| KRaft | Kafka's built-in consensus and metadata management architecture |

---

## Kafka Architecture

Kafka architecture consists of several components working together.

```text
Spring Boot Producer
        |
        | Sends records
        v
+--------------------------------+
|          Kafka Cluster         |
|                                |
|  Broker 1    Broker 2          |
|   P0 leader   P1 leader        |
|   P1 replica  P0 replica       |
|                                |
|             Broker 3           |
|              P0 replica        |
|              P1 replica        |
+--------------------------------+
        |
        | Consumers fetch records
        v
  Consumer Group
  +-------------+
  | Consumer 1  |
  | Consumer 2  |
  +-------------+
```

This is an illustrative architecture. Actual partition and replica placement depends on the cluster configuration.

The most important relationship is:

**Cluster → Brokers → Partition replicas → Records**

A topic contains partitions, and each partition has one or more replicas. Those replicas are hosted by brokers.

---

## What Is a Kafka Topic?

A topic is a named category where Kafka stores related records.

Examples:

```text
orders
payments
users
notifications
inventory-events
```

Suppose your Order Service publishes:

```text
OrderCreated
OrderPaid
OrderShipped
OrderCancelled
```

These events could be published to an `orders` topic, depending on your event design.

### Important points

- A topic is a logical name, not a separate server.
- A topic can contain one or many partitions.
- Multiple producer applications can publish to a topic.
- Multiple consumer groups can independently read a topic.
- A topic's retention policy determines when records become eligible for deletion.

Think of a topic as a large book containing order-related records.

Partitions are the separate, ordered sections of that book.

---

## What Is a Kafka Partition?

A partition is an ordered sequence of records inside a topic.

Suppose the `orders` topic has three partitions:

```text
Topic: orders
|
+-- Partition 0
|     Order A
|     Order D
|     Order G
|
+-- Partition 1
|     Order B
|     Order E
|     Order H
|
+-- Partition 2
      Order C
      Order F
      Order I
```

The example illustrates how records could be distributed. The actual distribution depends on the producer's partitioning strategy.

### Why do we need partitions?

Imagine your application produces one million order events.

If a topic has only one partition, all its records are appended to one partition log. A single consumer group cannot divide that partition among multiple consumer instances.

If the topic has three partitions, Kafka can distribute records among those partitions. Multiple consumers in the same consumer group can then process different partitions concurrently.

### Benefits of partitioning

- **Parallel processing:** Different consumers can process different partitions simultaneously.
- **Scalability:** Partition replicas can be distributed across brokers.
- **Distributed storage:** Different partitions can be hosted by different brokers.
- **Ordering:** Each partition maintains its own record order.

### Important limitation

Kafka guarantees order within a partition, not a single global order across every partition in a topic.

Also, creating more partitions does not automatically guarantee a balanced distribution or faster processing. Actual performance depends on keys, workload, broker capacity, and consumer processing.

---

## How Does Kafka Choose a Partition?

This was the most important concept we discussed.

Suppose you have:

```text
Topic: orders
Partitions: P0, P1, P2
```

Your Spring Boot Order Service publishes records.

Kafka's producer must determine which partition receives each record.

There are three common possibilities.

### Using a key

A key is a value associated with a record.

For example:

```text
Key: ACC-101
Value: Money deposited ₹1,000
```

The producer uses the key and its partitioning strategy to select a partition.

For the standard Java producer's default keyed partitioning, the process is conceptually:

```text
Account key: ACC-101
       |
       v
Calculate hash of serialized key
       |
       v
Use hash and partition count
       |
       v
Select a partition
```

Suppose the selected partition is P1.

Later, another record arrives:

```text
Key: ACC-101
Value: Money withdrawn ₹200
```

With the same key and unchanged partitioning configuration, the default keyed partitioner normally selects P1 again.

The result:

```text
Partition 1
------------------------------
Offset 0: Deposit ₹1,000
Offset 1: Withdraw ₹200
Offset 2: Deposit ₹500
```

The partition number is illustrative.

### What is a hash function?

A hash function calculates a number from a value.

For example:

```text
Input key → Hash function → Hash value
```

The producer uses that hash value and the number of available partitions to determine the destination.

You can think of it as a key-based routing mechanism, similar in spirit to using a key to determine where data belongs in a hash-based data structure.

However, Kafka does not use a Java `HashMap` to store all topic records or to choose every partition.

### Why use an account number or order ID as the key?

The key should match the entity whose event order you want to preserve.

| Requirement | Suitable key |
|---|---|
| Keep events for one order together | `orderId` |
| Keep events for one bank account together | `accountId` |
| Keep events for one customer together | `customerId` |
| Keep events for one product together | `productId` |

For example, if order `ORD-101` has an order-created event, payment event, and shipping event, using `ORD-101` as the key helps route these events to the same partition.

**Important:** If you increase the number of partitions, the mapping of a key to a partition may change. If strict per-entity ordering matters, consider this when planning partition-count changes.

### What happens without a key?

If a record has no key, the producer uses its configured partitioning strategy.

The standard Java producer commonly uses sticky partitioning for records without keys. This can batch records efficiently, so you should not assume it selects a new partition for every message.

### Can we explicitly select a partition?

Yes. The application can specify a partition number when publishing a record.

In Spring Kafka:

```java
kafkaTemplate.send(
    "orders",
    "ORD-101",
    "Order created"
);
```

Here, the arguments are topic, key, and value.

To specify the partition explicitly:

```java
kafkaTemplate.send(
    "orders",
    1,
    "ORD-101",
    "Order created"
);
```

The second argument specifies partition 1.

In real projects, key-based routing is often more appropriate than hardcoding partition numbers when related events need to stay together.

---

## What Is a Kafka Broker?

A broker is a running Kafka server that stores and serves partition replicas.

Think of a broker as one machine or one Kafka server process in your infrastructure.

For example:

```text
Broker 1 → localhost:9092
Broker 2 → localhost:9093
Broker 3 → localhost:9094
```

These could be separate Kafka processes on one development machine, using different ports and storage directories.

In production, brokers are commonly deployed on separate machines or containers distributed across infrastructure.

### What does a broker do?

- Stores partition data.
- Accepts writes from producers through partition leaders.
- Serves records to consumers.
- Replicates partition data to follower replicas.
- Participates in cluster operations.

### Important distinction

A partition is not a server.

A broker can host multiple partition replicas, and a topic's partitions can be distributed across multiple brokers.

---

## What Is a Kafka Cluster?

A Kafka cluster is a group of Kafka brokers operating together.

Example:

```text
Kafka Cluster
|
+-- Broker 1
|     P0 leader
|     P1 follower
|
+-- Broker 2
|     P1 leader
|     P0 follower
|
+-- Broker 3
      P2 leader
      P2 follower copies may exist elsewhere
```

This diagram is illustrative rather than a complete replica assignment.

### Why use multiple brokers?

Multiple brokers can provide:

- More total storage capacity.
- More processing and network capacity.
- Distribution of partition leaders and replicas.
- Fault tolerance when replicas are appropriately configured.

### Can a cluster have one broker?

Yes. A single-broker Kafka deployment is valid and useful for learning and development.

However, it cannot provide broker-level redundancy across different servers.

---

## Single Server vs Multiple Servers

This is another important doubt we resolved.

### Three partitions on one broker

```text
+--------------------------------+
|          Broker 1              |
|                                |
|  Partition 0                   |
|  Partition 1                   |
|  Partition 2                   |
+--------------------------------+
```

All three partitions are stored on the same broker.

You still have separate partition logs and can use multiple consumers to process the partitions concurrently.

However, the partitions share the server's CPU, disk, memory, and network resources.

If that broker fails, all three partitions become unavailable until recovery.

### Three partitions distributed across three brokers

```text
+-------------+  +-------------+  +-------------+
|  Broker 1   |  |  Broker 2   |  |  Broker 3   |
|             |  |             |  |             |
|     P0      |  |     P1      |  |     P2      |
+-------------+  +-------------+  +-------------+
```

This distributes the partition storage across servers.

However, this example alone does not provide redundancy. If P0 is stored only on Broker 1, a Broker 1 failure makes P0 unavailable until recovery.

To protect against broker failures, you need replicas on other brokers.

**Remember: Partitioning divides the data. Brokers host the data. Replication creates additional copies.**

---

## What Is a Kafka Record?

A record is one unit of data published to a topic.

A record can contain:

- Key
- Value
- Timestamp
- Headers
- Other metadata maintained by Kafka or the producer

Example:

```json
{
  "key": "ORD-101",
  "value": {
    "eventType": "OrderCreated",
    "orderId": "ORD-101",
    "amount": 2500
  }
}
```

This is an illustrative representation of a Kafka record. In a real application, the value is serialized into bytes before it is sent to Kafka.

### Key vs Value

- **Key:** Helps identify or group related records and may determine the partition.
- **Value:** Contains the actual event payload.

The key and value can both be strings, JSON serialized as bytes, or other supported serialized data.

For example:

```text
Key   = ORD-101
Value = OrderCreated event payload
```

---

## What Is an Offset?

An offset is the position of a record within a partition.

Example:

```text
Partition 0
------------------------------
Offset 0 → Order created
Offset 1 → Payment completed
Offset 2 → Order shipped
Offset 3 → Order delivered
```

The offset identifies a record's position within that partition's log.

### Important points

- Offsets are maintained separately for each partition.
- Partition 0 can have offset 0, and Partition 1 can also have offset 0.
- Offsets help consumers track their reading progress.
- A consumer can resume from an appropriate position after restarting, depending on its committed offsets and configuration.
- An offset is not a customer ID or order ID.

### Example

Suppose your consumer has processed records through offset 99 and committed its position.

After restarting, it can resume from the next appropriate record according to the committed position and consumer configuration.

Offset commits and record processing must be designed carefully to avoid unintended loss or duplicate processing.

---

## Producer and Consumer

### Producer

A producer is an application that publishes records to Kafka.

Example:

```text
Spring Boot Order Service
         |
         v
Kafka Producer
         |
         v
orders topic
```

A producer determines the topic and can provide a key, value, headers, and optionally an explicit partition.

The producer's partitioning logic selects the partition when one is not explicitly specified.

### Consumer

A consumer is an application that reads records from Kafka.

Example:

```text
orders topic
      |
      v
Inventory Consumer
      |
      v
Update inventory database
```

Consumers fetch records and execute application-specific logic.

Kafka does not automatically update your PostgreSQL database just because a record is consumed. Your consumer code must perform that work.

---

## What Is a Consumer Group?

A consumer group is a set of consumers sharing the work of reading a topic.

Suppose the `orders` topic has three partitions:

```text
orders topic
|
+-- P0
+-- P1
+-- P2
```

You start three Inventory Service consumer instances with the same group ID.

```text
Consumer Group: inventory-group

Consumer 1 → P0
Consumer 2 → P1
Consumer 3 → P2
```

Kafka assigns partitions to consumers in the group.

### Why are consumer groups useful?

They allow you to distribute the work across multiple consumer instances.

If a consumer fails, Kafka can reassign its partitions to surviving consumers, subject to group coordination and the availability of the relevant partitions.

### What if there are more consumers than partitions?

Suppose there are three partitions and five consumers in the same group.

```text
P0 → Consumer 1
P1 → Consumer 2
P2 → Consumer 3

Consumer 4 → No partition
Consumer 5 → No partition
```

In the conventional consumer-group model, each partition is assigned to at most one consumer instance in the group at a time.

Therefore, no more than three instances can actively read these three partitions in that group at once.

### Can multiple services read the same topic?

Yes. Different consumer groups can independently read the same topic.

```text
                    orders topic
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
       Inventory      Payment    Notification
        group          group         group
```

Each group maintains its own reading progress.

For example, Inventory Service processes stock updates, Payment Service handles payment events, and Notification Service sends messages.

One group's consumption does not normally advance another group's offsets.

---

## Message Ordering

Kafka guarantees record ordering within a partition.

Suppose a bank account has these events:

```text
1. Deposit ₹1,000
2. Withdraw ₹200
3. Deposit ₹500
```

If the records are appended to the same partition in that order, Kafka preserves that order in the partition log.

```text
Partition 1
------------------------------
Offset 0 → Deposit ₹1,000
Offset 1 → Withdraw ₹200
Offset 2 → Deposit ₹500
```

### Why does the key matter?

Using `accountId` as the key helps route records for the same account to the same partition.

That supports ordering per account.

However, Kafka does not guarantee a global order across multiple partitions.

Also, a partition's append order does not automatically guarantee that your application processes events in the correct business order if it uses asynchronous or parallel processing.

### Choosing the right key

```text
Need order per order       → Use orderId
Need order per account     → Use accountId
Need order per customer    → Use customerId
```

Choose the key according to the business entity whose events must remain together.

---

## Replication — Why Do We Need It?

Partitioning and replication solve different problems.

- **Partitioning:** Helps distribute data and processing.
- **Replication:** Helps protect data availability when a broker fails.

Imagine three partitions distributed across three brokers:

```text
Broker 1 → P0
Broker 2 → P1
Broker 3 → P2
```

If Broker 1 fails, P0 becomes unavailable if it has no replica on another broker.

Replication addresses this by keeping additional copies of each partition on other brokers.

### What is a replica?

A replica is a copy of a partition maintained by Kafka on a broker.

For example:

```text
P0 replica on Broker 1
P0 replica on Broker 2
P0 replica on Broker 3
```

These are three copies of the same logical partition, not three different partitions.

### Why is replication useful?

Suppose Broker 1 fails.

If an eligible in-sync replica of P0 exists on Broker 2, Kafka can elect that replica as the new leader.

This can allow producers and consumers to continue after a short interruption.

Replication is not an absolute guarantee against data loss. The outcome depends on replica synchronization, acknowledgments, and cluster configuration.

---

## Leader and Follower

Each partition replica has a role.

### Leader replica

The leader is the replica that handles normal reads and writes for that partition.

For example:

```text
Partition P0

Broker 1 → Leader
Broker 2 → Follower
Broker 3 → Follower
```

The producer normally sends a record to the leader of P0.

The consumer fetches records from the partition leader by default, although Kafka configurations can allow eligible follower fetching in supported setups.

### Follower replica

A follower copies data from the leader and keeps its local replica synchronized.

Followers provide redundant copies of the partition data and can be elected as leaders if eligible.

### What happens if the leader fails?

```text
Before failure:

Broker 1 → P0 Leader
Broker 2 → P0 Follower
Broker 3 → P0 Follower

Broker 1 fails.

After eligible replica election:

Broker 2 → P0 Leader
Broker 3 → P0 Follower
```

Kafka can continue serving P0 through the new leader, subject to the replica's eligibility and the cluster's availability configuration.

---

## Replication Factor

The replication factor specifies how many replicas Kafka is configured to maintain for each partition.

### Replication factor = 1

```text
P0 → Broker 1
```

One copy exists. There is no redundant copy on another broker.

### Replication factor = 2

```text
P0 → Broker 1 (Leader)
P0 → Broker 2 (Follower)
```

Two copies exist on different brokers in this example.

### Replication factor = 3

```text
P0 → Broker 1 (Leader)
P0 → Broker 2 (Follower)
P0 → Broker 3 (Follower)
```

Three copies exist: one leader and two followers.

For three partitions with replication factor three:

```text
3 partitions × 3 replicas = 9 partition replicas
```

These are nine physical/logical replica instances across brokers, but there are still only three logical partitions.

### Important rules

- Replication factor and partition count are separate settings.
- A replication factor of three does not mean there are three partitions.
- To place three replicas of a partition on three different brokers, you need at least three suitable brokers.
- Replication increases storage and network requirements.
- Replica placement matters: putting all copies on the same failed server would defeat the goal of broker-level redundancy.

---

## ISR — In-Sync Replicas

ISR means **In-Sync Replicas**.

These are replicas that are sufficiently caught up with the partition leader according to Kafka's replication rules.

For example:

```text
P0:
  Broker 1 → Leader, in sync
  Broker 2 → Follower, in sync
  Broker 3 → Follower, out of sync
```

The ISR contains the leader and eligible in-sync followers, not necessarily every configured replica at every moment.

ISR matters because Kafka uses replica synchronization and producer acknowledgment settings to determine when writes are considered sufficiently replicated.

---

## Fault Tolerance

Fault tolerance means the system can continue operating when some component fails.

Kafka uses more than one mechanism to support fault tolerance.

### Data fault tolerance

Partition replication protects against a broker failure.

```text
Broker 1 fails
      |
      v
Eligible in-sync replica elected
      |
      v
Partition may continue serving records
```

### Metadata fault tolerance

Kafka also needs to maintain information about the cluster, including topics, partitions, and replica assignments.

Modern Kafka uses KRaft controller quorum mechanisms to manage this metadata reliably.

### Important distinction

- Partition replicas protect the availability of topic data.
- The controller quorum protects Kafka's cluster metadata and coordination.

These are related, but they are not the same mechanism.

---

## ZooKeeper vs KRaft

Historically, Kafka used ZooKeeper for cluster coordination and metadata management.

ZooKeeper was a separate system from Kafka brokers.

Modern Kafka supports KRaft, which removes the external ZooKeeper dependency by using Kafka's built-in controller quorum and metadata log.

### Older architecture

```text
Kafka Brokers
      |
      v
ZooKeeper
```

ZooKeeper managed cluster coordination and metadata-related responsibilities for older Kafka deployments.

### Modern KRaft architecture

```text
Kafka Cluster
|
+-- Brokers
|
+-- KRaft Controllers
      |
      +-- Controller quorum
      +-- Metadata log
```

KRaft controllers manage cluster metadata using a replicated metadata log and a quorum-based consensus mechanism.

Controllers can run in dedicated processes or in combined broker/controller configurations, depending on deployment design.

### How does KRaft provide fault tolerance?

A controller quorum needs a majority of its voting members to remain available to make progress.

For example, with three voting controllers:

```text
Controller 1
Controller 2
Controller 3
```

A majority is two.

If one controller fails, the other two can still form a majority and continue making progress, assuming the remaining controllers are healthy and functioning correctly.

KRaft metadata fault tolerance and partition data replication are separate parts of Kafka's reliability architecture.

---

## End-to-End Industrial Example

Let's put everything together using an e-commerce application built with Spring Boot.

### Requirement

Customers place orders. Your application must:

- Publish order events.
- Distribute records for scalable processing.
- Keep related events together.
- Allow multiple consumer services to read the events.
- Remain available if a Kafka broker fails.

### Architecture

```text
                    Spring Boot
                    Order Service
                         |
                         v
                 Kafka Producer
                         |
                         | Key = orderId
                         v
              Topic: orders (3 partitions)
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
            P0          P1          P2
             |           |           |
             v           v           v
          Leader      Leader      Leader
             |
             | Replicas distributed across brokers
             v
       +-----------+-----------+-----------+
       | Broker 1  | Broker 2  | Broker 3  |
       +-----------+-----------+-----------+
                         |
                         v
                Consumer Groups
             /          |          \
            v           v           v
       Inventory     Payment   Notification
         Service     Service     Service
```

The diagram is conceptual; the exact partition leader and replica placement depends on the deployment configuration.

### Message flow

1. A customer places order `ORD-101`.
2. The Order Service creates an `OrderCreated` event.
3. The Kafka producer sends the record with key `ORD-101`.
4. The producer selects the partition using its partitioning strategy.
5. The broker hosting that partition's leader appends the record and assigns an offset.
6. Follower replicas copy the partition's data.
7. Inventory, Payment, and Notification consumer groups independently read the event.
8. Each service executes its own business logic.
9. Consumers manage their reading progress using offsets.

### What if a broker fails?

If a broker hosting a partition leader fails, Kafka can elect an eligible in-sync follower as the new leader.

If no suitable replica is available, that partition may remain unavailable until recovery.

### What if a consumer fails?

Kafka can reassign its partitions to other consumers in the same group.

The replacement consumer can resume from the appropriate committed position, subject to offset configuration and processing semantics.

---

## Important Kafka Commands

These examples assume a local Kafka installation where the command-line scripts are available.

### Create a topic

Create a topic named `orders` with three partitions and replication factor one:

```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic orders \
  --partitions 3 \
  --replication-factor 1
```

For a local single-broker setup, replication factor one is appropriate because there is no second broker to host another copy.

### Describe a topic

```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --describe \
  --topic orders
```

This shows information such as partition IDs, leaders, replicas, and ISR membership.

### List topics

```bash
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --list
```

### Publish messages from the console

```bash
kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders
```

### Consume messages from the console

```bash
kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --from-beginning
```

These console examples demonstrate basic message publishing and consumption. They do not by themselves demonstrate key-based routing unless the producer is configured to send keys.

---

## Quick Revision

| Question | Answer |
|---|---|
| What is Kafka? | A distributed event-streaming platform |
| What is a topic? | A named category of records |
| What is a partition? | An ordered log within a topic |
| What is a broker? | A running Kafka server |
| What is a cluster? | A group of Kafka brokers |
| What is a producer? | An application that publishes records |
| What is a consumer? | An application that reads records |
| What is a consumer group? | Consumers sharing the work of reading a topic |
| What is a key? | A value used for grouping and partition selection |
| What is a hash function? | A function that calculates a number from a value |
| What is an offset? | A record's position within a partition |
| Why use partitions? | Parallelism, scalability, and per-partition ordering |
| Why use replicas? | Redundancy and fault tolerance |
| What is a leader? | Replica that handles normal reads and writes |
| What is a follower? | Replica that copies data from the leader |
| What is replication factor three? | Three configured copies of each partition |
| What is ISR? | In-Sync Replicas |
| What is KRaft? | Kafka's built-in metadata and controller quorum architecture |

### Five concepts you must never confuse

**Topic vs Partition**
- Topic is the category.
- Partition is an ordered log within that category.

**Partition vs Broker**
- Partition is a data structure.
- Broker is the server hosting its replica.

**Partitioning vs Replication**
- Partitioning divides the topic into logs.
- Replication copies those logs.

**Key vs Offset**
- Key helps identify related records and select a partition.
- Offset identifies a record's position within a partition.

**Leader vs Follower**
- Leader handles normal reads and writes.
- Follower copies data and can become leader if eligible.

---

## Practice Questions

Use these questions to test your understanding before moving to more advanced Kafka concepts.

- [ ] What problem does Kafka solve in microservices?
- [ ] What is the difference between a topic and a partition?
- [ ] Can three partitions exist on a single broker?
- [ ] How does a producer choose a partition?
- [ ] Why would you use `orderId` as a partition key?
- [ ] What happens if a topic has three partitions but five consumers in one group?
- [ ] Does Kafka guarantee ordering across multiple partitions?
- [ ] What is the difference between a partition and a replica?
- [ ] What happens when a partition leader fails?
- [ ] How does replication factor differ from partition count?
- [ ] What is the purpose of ISR?
- [ ] How does KRaft differ from the older ZooKeeper architecture?

> [!tip] Recommended learning order
> First, become comfortable with topics, partitions, keys, and offsets. Next, learn brokers, clusters, replicas, and leader election. Then study consumer groups, offset commits, delivery semantics, retention, and KRaft. This sequence will make Kafka's internal architecture much easier to understand.
