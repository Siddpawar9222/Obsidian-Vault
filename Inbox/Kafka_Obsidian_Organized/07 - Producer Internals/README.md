# Producer Internals

> [!abstract] Learning status
> **Covered conceptually:** producer workflow, batching, `batch.size`, `linger.ms`, producer retries, idempotent producer, PID, sequence numbers, and the relationship between acknowledgements and replication.
>
> **Still to study:** compression trade-offs in depth, buffer exhaustion, delivery timeout, request timeout, callbacks, and hands-on failure experiments.

## What this module explains

A Kafka producer is the client application that creates records and sends them to Kafka. It does more than simply send a message: it obtains metadata, chooses a partition, serializes the key/value, groups records into batches, and sends requests to partition leaders.

## Producer end-to-end workflow

```text
Application
   |
   | send(topic, key, value)
   v
Kafka Producer API
   |
   +--> Serialize key and value into byte arrays
   |
   +--> Determine target partition
   |
   +--> Check metadata: which broker is the partition leader?
   |
   +--> Append record to that partition's batch in the Record Accumulator
   |
   +--> Sender thread sends ready batches to broker leaders
   |
   v
Kafka Broker
   |
   +--> Append record to partition log
   +--> Replicate according to replication configuration
   +--> Send acknowledgement according to acks setting
   |
   v
Producer receives success/failure result
```

## Record Accumulator and batching

The producer does not normally send every record as a separate network request. It collects records into batches.

- A batch is maintained per topic-partition.
- Records destined for different partitions are placed in different batches.
- The Record Accumulator holds these batches until they are ready to be sent.
- A background sender thread sends ready batches to the appropriate partition leaders.

### `batch.size`

`batch.size` is the target upper size, in bytes, of a batch for one partition. It is not a limit on the complete producer request or on the total memory used by the producer.

When a partition's batch becomes full, it can be sent without waiting for `linger.ms`.

### `linger.ms`

`linger.ms` is the maximum intentional time the producer waits for more records to join a batch before sending it, if the batch has not filled.

Example:

```text
batch.size = 16 KB
linger.ms  = 5 ms

Records arrive for Partition 0:
  Record A
  Record B
  Record C

If the batch fills before 5 ms:
  Send immediately.

If the batch is still not full after 5 ms:
  Send the partial batch.
```

The producer does not wait forever for a batch to fill. `linger.ms` trades a small amount of latency for potentially better batching and throughput.

**Important:** batching is per partition. A busy partition may fill its batch quickly while a quiet partition may send a smaller batch after the linger period.

## Producer buffer memory

`buffer.memory` controls the approximate total memory available to buffer records waiting to be sent. It is not the size of one batch.

If the producer cannot send records quickly enough and the buffer becomes full, calls that need buffer space can block up to `max.block.ms`, after which the send operation can fail with a timeout.

## Producer acknowledgements

The `acks` setting controls how much acknowledgement the producer waits for from Kafka.

| Setting | Meaning | Trade-off |
|---|---|---|
| `acks=0` | Producer does not wait for a broker acknowledgement. | Lowest acknowledgement assurance; a lost request may go unnoticed. |
| `acks=1` | Leader acknowledges after it has appended the record locally. | Better than 0, but a leader failure before replication can cause data loss. |
| `acks=all` | Leader waits for all current in-sync replicas required by Kafka's replication rules. | Stronger durability, usually with more acknowledgement latency. |

### `acks=all` and `min.insync.replicas`

These settings work together:

- `acks=all` says the producer wants acknowledgement after the write has been accepted by the required ISR set.
- `min.insync.replicas` is a broker/topic-side minimum ISR requirement for accepting writes with `acks=all`.
- If the current ISR count is below the configured minimum, the write is rejected rather than silently accepting a write with insufficient replicas.

Example:

```text
Replication factor = 3
Current ISR         = 3
min.insync.replicas = 2
acks                = all

Write can be accepted.
```

If one replica goes offline, ISR may become 2; writes can still be accepted. If another replica falls out of ISR and ISR becomes 1, writes with `acks=all` are rejected while the minimum is 2.

**Do not confuse:** replication factor is the number of configured replicas; ISR is the subset currently considered in sync.

## Producer retries

A producer may not receive an acknowledgement even though the broker stored the record. For example, the broker may store the record and the acknowledgement may be lost on the network.

The producer may retry because it cannot know whether the original request succeeded.

```text
Producer                  Broker
   |                         |
   |------ Produce A ------->|
   |                         | Appends A
   |<--- ACK lost in network |
   |                         |
   |------ Retry A --------->|
   |                         |
```

Without idempotence, a retry can append a duplicate record. Producer retries address transient send failures; they do not automatically make application business operations idempotent.

## Idempotent producer

An idempotent producer prevents duplicate log entries caused by producer retries within the supported producer session/protocol.

Kafka uses:

- **Producer ID (PID):** identifies the producer session.
- **Per-partition sequence numbers:** identify the order of records sent by that producer to a partition.
- **Broker-side tracking:** detects duplicate or out-of-order sequence numbers and avoids appending a retry duplicate.

Conceptual example:

```text
Producer sends record A to Partition 0 with sequence 5.
Broker appends sequence 5.
ACK is lost.
Producer retries sequence 5.
Broker recognizes the duplicate sequence and does not append A again.
```

### What idempotent producer does not guarantee

It does not deduplicate:
- Two separate application sends that represent the same business event but are assigned new sequence numbers.
- Duplicate events produced by different producer instances.
- Duplicate database updates performed by a consumer.
- An external API call made twice by consumer business logic.

That is why consumer-side idempotency is a separate topic.

## Producer retries vs delivery guarantees

Producer idempotence and consumer delivery semantics solve different problems.

- Producer idempotence prevents duplicate Kafka log entries caused by eligible producer retries.
- Consumer offset/commit strategy determines whether a consumer may reprocess records.
- Application-level idempotency protects business effects such as charging a customer or creating a database row.

## Key revision points

- Batches are maintained per topic-partition.
- `batch.size` controls the target batch size; `linger.ms` controls intentional waiting for more records.
- `buffer.memory` is producer-wide buffering capacity, not one batch's size.
- `acks` controls acknowledgement strength.
- `acks=all` and `min.insync.replicas` must be understood together.
- Retries can create duplicates when idempotence is not used.
- Idempotent producer uses PID and per-partition sequence numbers to detect retry duplicates.
- Producer idempotence is not the same as an idempotent consumer.

## Topics still pending in this module

- Compression algorithms: gzip, Snappy, LZ4, and Zstandard.
- `request.timeout.ms`, `delivery.timeout.ms`, and `max.block.ms`.
- Producer callbacks and asynchronous send result handling.
- Practical experiments with broker failure and producer acknowledgements.
