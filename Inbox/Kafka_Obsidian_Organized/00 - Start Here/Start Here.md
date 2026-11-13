# Kafka Learning Vault — Start Here

This vault is organized to take you from Kafka fundamentals to practical Spring Boot microservices integration.

## Recommended learning order

| Order | Folder | What it covers | Current status |
|---|---|---|---|
| A | [[01 - Foundations/001-Introduction_and_Problem_Statement]] | Kafka purpose, architecture and terminology | Covered |
| B | [[02 - Topics and Partitioning/004-Topics_and_Partitions]] | Topics, partitions, keys and ordering | Covered |
| C | [[03 - Consumers and Consumer Groups/006-Consumers_and_Consumer_Groups]] | Consumer groups and partition assignment | Covered |
| D | [[04 - Replication and KRaft/007-Replication_and_Fault_Tolerance]] | Replication, ISR and failover | Covered |
| E | [[04 - Replication and KRaft/008-KRaft_and_Cluster_Consensus]] | Controllers, metadata and Raft quorum | Covered |
| F | [[07 - Producer Internals/README]] | Batching, acknowledgements, retries and producer idempotence | Mostly covered; some details pending |
| G | [[08 - Consumer Internals/README]] | Polling, commits, heartbeats and delivery semantics | Mostly covered; some details pending |
| H | [[09 - Serialization and Schemas/README]] | JSON, DTOs, serializers and deserializers | Basic concepts covered; schema topics pending |
| I | [[10 - Reliability and Error Handling/README]] | Retry, DLT, idempotent consumers and transactions | Not yet covered |
| J | [[11 - Storage and Retention/README]] | Segments, retention and compaction | Not yet covered |
| K | [[06 - Spring Boot Integration/012-HandsOn_SpringBoot_Step_By_Step_Guide]] | Build and integrate Spring Boot services | Conceptual introduction started; practical build pending |

## Current learning checkpoint

The learning covered so far includes:
- Kafka cluster, brokers, topics, partitions, offsets and message keys.
- Key-based partition routing and ordering.
- Consumer groups, partition assignment and independent groups.
- Replication, leader/follower, ISR and failover.
- KRaft controllers, metadata log and quorum.
- Producer batching, `batch.size`, `linger.ms`, retries and idempotent producer.
- Consumer polling, heartbeats, rebalancing, offset commits and delivery semantics.
- Serialization/deserialization, JSON DTOs, Spring Kafka serializer configuration, `KafkaTemplate` and `@KafkaListener` concepts.

**Reliability and Error Handling is intentionally the next learning module, not a completed module.**

## Master tracker

Use [[syllabus]] to see each topic's learning status and what remains.
