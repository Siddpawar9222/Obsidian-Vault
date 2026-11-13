# Consumer Internals, Offsets and Delivery Semantics

> [!abstract] Learning status
> **Covered:** consumer polling, `poll()`, `max.poll.records`, fetch/poll distinction, heartbeats, session timeout, `max.poll.interval.ms`, rebalancing, auto/manual commits, `commitSync()` vs `commitAsync()` at a conceptual level, offset reset, delivery semantics, and contiguous offset commits.
>
> **Still to study:** detailed fetch tuning, assignment strategies, eager vs cooperative rebalancing, static membership, and practical Spring acknowledgement modes.

## Consumer fundamentals

A Kafka consumer reads records from topic partitions. Kafka uses a **pull model**: the consumer requests records by polling the broker. Kafka does not normally push each record directly into the application.

A consumer has two important positions:

- **Current position:** the next offset the consumer will return from its local consumption position.
- **Committed offset:** the durable progress saved for the consumer group. It represents the next offset the group should read after restarting or reassignment.

Committed offsets for consumer groups are stored in Kafka's internal topic `__consumer_offsets`.

## Polling lifecycle

The application repeatedly calls:

```java
ConsumerRecords<String, Order> records =
    consumer.poll(Duration.ofMillis(100));
```

Conceptual flow:

```text
Consumer application
       |
       | poll()
       v
Kafka broker / group coordinator
       |
       | returns available records
       v
Consumer receives records
       |
       | application processes records
       v
Consumer commits progress
       |
       v
Repeat poll()
```

The consumer may fetch records in batches. `poll()` returns records that have already been fetched or are available from the broker.

### `max.poll.records`

Limits the maximum number of records returned by one `poll()` call. It is not a per-partition limit and does not necessarily mean Kafka always returns exactly that number.

### Fetch settings (introduction)

- `fetch.min.bytes`: minimum amount of data the broker should try to accumulate before responding to a fetch request.
- `fetch.max.wait.ms`: maximum time the broker waits for the fetch request to reach the minimum data threshold before responding.
- These settings can influence batching, throughput, and latency.

## Polling, heartbeats and group membership

A consumer group coordinator manages group membership and partition assignment.

Consumers send heartbeats so the coordinator knows they are alive.

| Setting | Purpose |
|---|---|
| `heartbeat.interval.ms` | Approximate interval between heartbeats. |
| `session.timeout.ms` | How long the coordinator can go without a heartbeat before considering the consumer failed. |
| `max.poll.interval.ms` | Maximum allowed time between calls to `poll()` before the consumer is considered unable to make progress. |

Heartbeats and polling are related but not identical. A background heartbeat can continue while application processing is slow, but exceeding `max.poll.interval.ms` can still cause the consumer to leave the group and trigger reassignment.

## Rebalancing

A rebalance is the process of redistributing topic partitions among members of a consumer group.

Common triggers:
- A consumer joins the group.
- A consumer leaves normally.
- A consumer crashes or stops heartbeating.
- A consumer exceeds `max.poll.interval.ms`.
- Subscription or group membership changes.

Example:

```text
Before:
Partition 0 -> Consumer A
Partition 1 -> Consumer B
Partition 2 -> Consumer C

Consumer B leaves.

After rebalance:
Partition 0 -> Consumer A
Partition 1 -> Consumer C
Partition 2 -> Consumer A
```

During a rebalance, partition ownership changes. Processing may pause briefly, and records that were processed but not committed can be delivered again.

## Automatic offset commit

With automatic commits enabled, Kafka periodically commits the consumer's current position.

Example configuration:

```properties
enable.auto.commit=true
auto.commit.interval.ms=5000
```

Potential problem: the consumer may have polled records and advanced its position, but application processing may not have completed when the offset is committed. If the application crashes after the commit but before processing finishes, those records may be skipped after restart.

Automatic commit is convenient, but the application must understand the relationship between polling, processing, and committing.

## Manual offset commit

Manual commit gives the application control over when progress is committed.

Typical configuration:

```properties
enable.auto.commit=false
```

A simplified safe sequence for a fully successful batch is:

```text
Poll records
   |
Process all records successfully
   |
Commit the next offset
```

If processing fails, do not commit past the failed record.

### `commitSync()` vs `commitAsync()`

| Method | Behavior | Main consideration |
|---|---|---|
| `commitSync()` | Waits for the commit request to complete or fail. | Simpler ordering; can block the consumer thread. |
| `commitAsync()` | Sends the commit request without waiting for completion. | Better non-blocking behavior, but failures and callback ordering need careful handling. |

An old asynchronous commit retry must not overwrite a newer committed offset with an older one. Applications should handle callback failures carefully.

## Understanding offsets correctly

A committed offset is the **next record to consume**, not the last record already processed.

Example:

```text
Offsets: 10, 11, 12, 13, 14

10 -> successfully processed
11 -> successfully processed
12 -> failed
13 -> not processed
14 -> not processed
```

The safe committed offset is **12**.

Why?
- On restart, Kafka resumes from offset 12.
- Offsets 10 and 11 do not need to be processed again.
- Offset 12 is delivered again because it failed.
- Committing 13 would skip the failed offset 12.

If offsets 20, 21, 22, and 23 all succeed, commit **24**.

### Contiguous completion rule

For each partition, commit the next offset after the highest **continuously successful** record.

This matters when records are processed asynchronously or in parallel. Suppose offset 12 is still failing while offset 13 succeeds. You must not commit 14, because doing so would skip offset 12 after a restart.

Also be careful with a plain `commitSync()` after a poll: the consumer's current position may already be beyond the last record your application successfully processed. For partial batch failures or asynchronous processing, track successful offsets and commit explicit per-partition offsets.

## `auto.offset.reset`

This setting is used only when the group has no valid committed offset, or its committed offset is no longer available.

| Value | Meaning |
|---|---|
| `earliest` | Start from the earliest available offset. |
| `latest` | Start from the end and receive new records. |
| `none` | Throw an error if no valid committed offset exists. |

It does **not** override an existing valid committed offset.

## Delivery semantics

Delivery semantics describe the relationship between record processing and offset commits.

### At-most-once

Commit progress before processing.

```text
Commit offset
   |
Process record
```

If the application crashes after committing but before processing, the record can be lost from the application's point of view.

- Possible duplicate processing: minimized.
- Possible loss: yes.

### At-least-once

Process first, then commit progress.

```text
Process record
   |
Commit offset
```

If the application crashes after processing but before committing, Kafka can deliver the record again.

- Possible loss from this commit timing: avoided.
- Duplicate processing: possible.

### Exactly-once

Exactly-once is not achieved simply by choosing manual commits. Kafka transactions can provide exactly-once processing for supported Kafka-to-Kafka workflows. When external systems such as relational databases or payment gateways are involved, additional coordination and idempotency patterns are needed.

## Manual commits vs delivery semantics

These concepts are related but not identical:

- **Manual commit** is a mechanism that lets application code decide when to commit.
- **At-most-once / at-least-once** describe the resulting processing guarantee based on the order of processing and committing.
- Manual commit after successful processing is commonly used to implement at-least-once behavior.
- Manual commit before processing can implement at-most-once behavior, but risks loss.

## Consumer group scaling reminder

- A partition can be assigned to at most one consumer in a consumer group at a time.
- A consumer can receive multiple partitions.
- With 3 partitions and 5 consumers in one group, at most 3 consumers can be active for those partitions; 2 remain without an assignment.
- Different consumer groups independently consume the same topic and maintain independent offsets.

## Key revision points

- Consumers pull records using `poll()`.
- `max.poll.records` limits records returned per poll, not per partition.
- Heartbeats indicate group membership liveness; `max.poll.interval.ms` protects against consumers that are not making poll progress.
- Rebalances redistribute partitions.
- A committed offset is the next offset to read.
- `auto.offset.reset` applies only when no valid committed offset is available.
- At-most-once: commit before processing; at-least-once: process before commit.
- With partial or asynchronous processing, commit only the next offset after contiguous successful work.

## Topics still pending in this module

- Fetch tuning in depth.
- Eager vs cooperative/incremental rebalancing.
- Partition assignment strategies.
- Static membership (`group.instance.id`).
- Spring Kafka acknowledgment modes and listener-container commit behavior.
- Hands-on crash/rebalance and offset experiments.
