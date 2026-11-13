# Apache Kafka — Master Syllabus and Progress Tracker

> Goal: Understand Kafka fundamentals and internals, then apply them in Java/Spring Boot microservices. This is a backend-developer learning path, not an exhaustive Kafka administrator certification syllabus.

## Learning status legend

- [x] Covered conceptually in our learning discussions or existing notes.
- [~] Introduced or partially covered; needs deeper study or practical verification.
- [ ] Not covered yet.
- [P] Hands-on implementation task.

> **Scope of this update:** This tracker records learning completed up to Serialization and Spring Kafka consumer basics. The Reliability and Error Handling module is intentionally excluded from completed topics.

## Module A — Kafka Foundations and Architecture

- [x] What Apache Kafka is and why it is used
- [x] Synchronous REST vs asynchronous event-driven communication
- [x] Kafka use cases and benefits
- [x] Event, record/message, key, value, headers, timestamp (conceptual)
- [x] Topic, partition, offset, broker, cluster
- [x] Producer and consumer roles
- [x] Kafka architecture and end-to-end message flow
- [x] Pull model vs push model
- [x] Sequential disk I/O
- [x] Operating system page cache
- [x] Zero-copy (`sendfile`)
- [x] Batching and compression (architecture-level introduction)

**Notes:** [[01 - Foundations/001-Introduction_and_Problem_Statement]], [[01 - Foundations/002-Core_Terminologies]], [[01 - Foundations/003-Kafka_Architecture_and_Internals]]

## Module B — Topics, Partitions, Routing, and Ordering

- [x] Topic structure and topic configuration
- [x] Partition as an ordered, append-only log
- [x] Why partitions provide parallelism and scalability
- [x] Partition vs broker vs topic
- [x] Single-broker vs multi-broker topology
- [x] Producer partition-selection strategies
- [x] Key-based partitioning and hash-based routing
- [x] Default partitioner and sticky partitioning
- [x] Explicit partition selection
- [x] Choosing a business partition key (`orderId`, `accountId`, etc.)
- [x] Ordering guarantee within a partition
- [x] Why Kafka does not guarantee global ordering
- [x] Effect of increasing partition count on key-to-partition mapping

**Notes:** [[02 - Topics and Partitioning/004-Topics_and_Partitions]], [[02 - Topics and Partitioning/005-Producer_Partitioning_and_Ordering]]

## Module C — Consumers and Consumer Groups

- [x] Consumer workflow and pull-based consumption
- [x] Consumer groups and their purpose
- [x] Partition assignment within a consumer group
- [x] One partition is assigned to at most one consumer in a group at a time
- [x] More consumers than partitions
- [x] Fewer consumers than partitions
- [x] Multiple independent consumer groups reading the same topic
- [x] Consumer scaling and load distribution
- [x] Introductory offset tracking and commits

**Notes:** [[03 - Consumers and Consumer Groups/006-Consumers_and_Consumer_Groups]]

## Module D — Replication, Durability, and Fault Tolerance

- [x] Partitioning vs replication
- [x] Replica, leader, and follower
- [x] Replication factor and broker placement
- [x] ISR (In-Sync Replicas)
- [x] Follower replication and synchronization
- [x] Out-of-sync replicas and ISR removal
- [x] Leader failover
- [x] Clean vs unclean leader election
- [x] High Watermark (HW)
- [x] Log End Offset (LEO)
- [x] Leader epoch
- [x] Eligible Leader Replicas (ELR)
- [x] Last Known ELR
- [x] Producer acknowledgements: `acks=0`, `acks=1`, `acks=all` (conceptual)
- [x] `min.insync.replicas` (conceptual)
- [~] How acknowledgements, ISR, and minimum ISR work together; practical failure experiments
- [~] Durability trade-offs and failure scenarios

**Notes:** [[04 - Replication and KRaft/007-Replication_and_Fault_Tolerance]]

## Module E — KRaft and Cluster Metadata Consensus

- [x] Why Kafka moved away from ZooKeeper
- [x] Cluster metadata vs business records
- [x] KRaft architecture
- [x] Raft consensus fundamentals
- [x] Controller and broker roles
- [x] Active controller and controller quorum
- [x] `__cluster_metadata` metadata log
- [x] Metadata replication across controllers
- [x] Topic creation and metadata update flow
- [x] Raft leader vs partition leader
- [x] Majority/quorum calculation
- [x] Controller failure and leader election
- [x] Broker failure vs controller failure
- [x] Epochs and metadata snapshots
- [x] Combined mode vs dedicated mode
- [x] Cluster ID, node ID, and controller quorum voters

**Notes:** [[04 - Replication and KRaft/008-KRaft_and_Cluster_Consensus]]

## Module F — Producer Internals

- [x] Producer send workflow (conceptual)
- [x] Producer batching and Record Accumulator (conceptual)
- [x] `batch.size`
- [x] `linger.ms`
- [~] Producer buffer memory and `buffer.memory`
- [x] Producer retry problem and why an acknowledgement can be uncertain
- [x] Idempotent producer introduction
- [x] Producer ID (PID) and per-partition sequence numbers
- [x] Producer acknowledgements (`acks=0`, `acks=1`, `acks=all`)
- [x] `acks=all` and `min.insync.replicas` relationship (conceptual)
- [ ] Compression (`gzip`, `snappy`, `lz4`, `zstd`) and trade-offs
- [ ] `delivery.timeout.ms`, `request.timeout.ms`, and `max.block.ms`
- [ ] Producer callbacks and asynchronous send result handling
- [ ] Practical producer failure experiments

**Notes:** [[07 - Producer Internals/README]]

## Module G — Consumer Internals, Offsets, and Delivery Semantics

- [x] `poll()` lifecycle and consumer polling loop (conceptual)
- [x] Pull-based fetching
- [x] `max.poll.records`
- [~] `fetch.min.bytes` and `fetch.max.wait.ms`
- [x] Automatic offset commit
- [x] Manual offset commit
- [x] `commitSync()` vs `commitAsync()` (conceptual)
- [x] Consumer position vs committed offset
- [x] Offset reset: `earliest`, `latest`, `none`
- [x] At-most-once delivery
- [x] At-least-once delivery
- [x] Exactly-once semantics: introductory distinction
- [x] How commit timing affects delivery semantics
- [x] Duplicate processing scenarios (conceptual)
- [x] Consumer rebalancing and why it happens
- [~] Eager vs cooperative/incremental rebalancing
- [ ] Partition assignment strategies
- [x] Heartbeats, session timeout, and `max.poll.interval.ms`
- [x] What happens when a consumer crashes and recovers from committed offset
- [ ] Static membership (introduction)
- [~] Contiguous successful offset commits, including partial/async processing

**Notes:** [[08 - Consumer Internals/README]]

## Module H — Serialization, Event Design, and Schemas

- [x] Serialization and deserialization
- [x] Kafka `Serializer` and `Deserializer` responsibilities
- [x] Key and value serialization
- [x] JSON serialization and deserialization
- [x] Java DTO event mapping
- [x] Field-name mismatch and `@JsonProperty`
- [x] Spring Kafka `JsonSerializer` and `JsonDeserializer`
- [x] Spring Boot producer serializer configuration
- [x] Spring Boot consumer deserializer configuration
- [x] `KafkaTemplate` delegates serialization to producer serializers
- [x] `@KafkaListener` receives deserialized DTOs
- [x] Consumer groups independently consuming the same event
- [ ] Kafka record headers and timestamps in practice
- [ ] Custom serializers and deserializers
- [ ] Poison pill handling / `ErrorHandlingDeserializer`
- [ ] Schema evolution
- [ ] Schema Registry (introduction)
- [ ] Avro (introduction)
- [ ] Backward, forward, and full compatibility

**Notes:** [[09 - Serialization and Schemas/README]]

## Module I — Reliability and Error Handling (NOT YET COVERED)

- [ ] Producer-side retry behavior in depth
- [ ] Consumer processing failures
- [ ] Retry strategies and retry topics
- [ ] Backoff: fixed, exponential, and jitter
- [ ] Blocking vs non-blocking retries
- [ ] Dead Letter Topic (DLT)
- [ ] Dead Letter Publishing and DLT metadata
- [ ] Poison pill messages and recovery
- [ ] Duplicate message handling
- [ ] Idempotent consumer design
- [ ] Database deduplication using event/message IDs
- [ ] Database transaction vs Kafka offset commit challenge
- [ ] Inbox pattern
- [ ] Outbox pattern
- [ ] Kafka transactions and transactional ID
- [ ] Atomic writes across Kafka partitions
- [ ] `read_committed` vs `read_uncommitted`
- [ ] Kafka exactly-once processing overview
- [ ] Kafka transactions vs database transactions

**Notes:** [[10 - Reliability and Error Handling/README]]

## Module J — Kafka Storage, Retention, and Compaction

- [ ] Kafka log structure
- [ ] Log segments and active segment
- [ ] Segment rolling
- [ ] Offset index and timestamp index
- [ ] Retention policy
- [ ] Time-based retention (`retention.ms`)
- [ ] Size-based retention (`retention.bytes`)
- [ ] Delete cleanup policy
- [ ] Log compaction
- [ ] `cleanup.policy=delete` vs `compact`
- [ ] Tombstone records
- [ ] How Kafka removes old segments and compacted records

## Module K — Spring Boot and Spring Kafka

- [x] Configure bootstrap servers
- [x] Configure producer key/value serializers
- [x] Configure consumer key/value deserializers
- [x] Publish with `KafkaTemplate` (conceptual)
- [x] Consume with `@KafkaListener` (conceptual)
- [x] Configure consumer groups
- [x] JSON DTO conversion flow
- [ ] Add dependency and build runnable services
- [ ] Create topics with `KafkaAdmin` / `NewTopic`
- [ ] Configure listener concurrency
- [ ] Manual acknowledgement modes
- [ ] Producer callbacks and asynchronous send handling
- [ ] Error handling with `DefaultErrorHandler`
- [ ] Retry and backoff configuration
- [ ] `DeadLetterPublishingRecoverer`
- [ ] `@RetryableTopic` (where appropriate)
- [ ] Idempotent consumer with database deduplication
- [ ] Kafka transactions in Spring
- [ ] Batch listeners
- [ ] Graceful shutdown and operational configuration

**Practical guide:** [[06 - Spring Boot Integration/012-HandsOn_SpringBoot_Step_By_Step_Guide]]

## Module L — Performance, Monitoring, and Operations

- [ ] Producer throughput and latency trade-offs
- [ ] Batching and compression tuning
- [ ] Consumer concurrency and throughput
- [ ] Consumer lag: what it means and how to monitor it
- [ ] Broker/topic/partition metrics
- [ ] Spring Boot Actuator and Prometheus
- [ ] Throughput benchmarking
- [ ] CLI-based troubleshooting
- [ ] Operational health checks and graceful recovery

**Command reference:** [[05 - Operations and Revision/010-Kafka_CLI_Commands]]

## Module M — Kafka Ecosystem

- [ ] Kafka vs RabbitMQ
- [ ] When to choose Kafka vs a traditional message broker
- [ ] Kafka Connect
- [ ] Source and sink connectors
- [ ] Kafka Streams
- [ ] Stream processing use cases

## Module N — End-to-End Practical Project

Build an event-driven order management system:

```text
Order Service
    |
    | OrderCreated event
    v
  Kafka
    |
    +------> Inventory Service
    |
    +------> Payment Service
    |
    +------> Notification Service
```

- [P] Run a multi-broker KRaft cluster locally using Docker Compose
- [P] Verify topic creation, partitioning, replication, and leader failover
- [P] Build Spring Boot producer and consumer services
- [P] Verify key-based partitioning and ordering
- [P] Run multiple consumer instances and observe assignments/rebalances
- [P] Use multiple consumer groups for independent processing
- [P] Exchange JSON DTO events
- [ ] Implement retries and DLT
- [ ] Implement idempotent consumer processing
- [ ] Experiment with Kafka transactions
- [ ] Monitor consumer lag and basic metrics

## Main notes index

- [[01 - Foundations/001-Introduction_and_Problem_Statement]]
- [[01 - Foundations/002-Core_Terminologies]]
- [[01 - Foundations/003-Kafka_Architecture_and_Internals]]
- [[02 - Topics and Partitioning/004-Topics_and_Partitions]]
- [[02 - Topics and Partitioning/005-Producer_Partitioning_and_Ordering]]
- [[03 - Consumers and Consumer Groups/006-Consumers_and_Consumer_Groups]]
- [[04 - Replication and KRaft/007-Replication_and_Fault_Tolerance]]
- [[04 - Replication and KRaft/008-KRaft_and_Cluster_Consensus]]
- [[05 - Operations and Revision/009-End_to_End_Industrial_Example]]
- [[05 - Operations and Revision/010-Kafka_CLI_Commands]]
- [[05 - Operations and Revision/011-Quick_Revision_and_Interview_Guide]]
- [[06 - Spring Boot Integration/012-HandsOn_SpringBoot_Step_By_Step_Guide]]
- [[07 - Producer Internals/README]]
- [[08 - Consumer Internals/README]]
- [[09 - Serialization and Schemas/README]]
- [[10 - Reliability and Error Handling/README]]
