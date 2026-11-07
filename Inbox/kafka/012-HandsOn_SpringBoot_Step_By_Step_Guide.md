# 012. Hands-On Spring Boot & Kafka: Incremental Practical Guide

> [!abstract] Purpose & Learning Roadmap
> A complete, incremental, code-first guide to building a real-world Apache Kafka microservices system using **Spring Boot 3.x** and **Java 17/21**.
> 
> Follow these steps sequentially:
> 1. **Steps 1–5 (Verifying Covered Concepts):** Visually see partitions, key hashing, consumer groups, rebalances, and leader failover in action.
> 2. **Steps 6–12 (Mastering Non-Covered Syllabus):** Incrementally implement DTO serialization, poison-pill protection, idempotency, retries with Dead Letter Topics (DLT), transactions, performance tuning, and Prometheus lag monitoring.

---

## 🧭 Navigation
- **Previous Note:** [[011-Quick_Revision_and_Interview_Guide.md|← 011. Quick Revision & Interview Guide]]
- **Syllabus & Master Tracker:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]

---

## 🏗️ Incremental Project Progression Map

```text
[Phase 1: Environment & Foundations]
  Step 1: 3-Broker KRaft Cluster + Kafka UI (Docker Compose)
  Step 2: Basic Spring Boot Producer & Consumer
  Step 3: Key-Based Partitioning & Message Ordering (Seeing Hashing live)
  Step 4: Consumer Groups, 1-to-1 Partition Rule & Rebalancing live
  Step 5: Multiple Consumer Groups (Broadcast Pattern)

[Phase 2: Implementing Advanced & Non-Covered Syllabus]
  Step 6: Event Design, JSON DTOs & ErrorHandlingDeserializer (Poison Pills)
  Step 7: Idempotent Consumer & At-Least-Once Deduplication (DB Unique Constraint)
  Step 8: Consumer Resiliency: Non-Blocking Retries & Dead Letter Topics (DLT)
  Step 9: Distributed Transactions & Exactly-Once Semantics (EOS)
  Step 10: High-Throughput Performance Tuning (Batching, Linger, Snappy)
  Step 11: Production Monitoring: Exposing Consumer Lag with Prometheus & Grafana
  Step 12: Real-Time Stream Processing with Kafka Streams (Aggregations)
```

---

# Part 1: Hands-On Verification of Covered Concepts

---

## Step 1: Local 3-Broker KRaft Cluster + Visual Web UI

Before writing Java code, create a production-like multi-broker cluster with a visual management dashboard using Docker Compose.

### 1. Create `docker-compose.yml`
In a new project folder (e.g. `kafka-spring-lab/`), create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  broker-1:
    image: confluentinc/cp-kafka:7.6.0
    container_name: broker-1
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://broker-1:29092,PLAINTEXT_HOST://localhost:9092'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:29092,CONTROLLER://0.0.0.0:29093,PLAINTEXT_HOST://0.0.0.0:9092'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@broker-1:29093,2@broker-2:29093,3@broker-3:29093'
      CLUSTER_ID: '4L622SOXRZ-haSD5nJ_Tribe'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 2

  broker-2:
    image: confluentinc/cp-kafka:7.6.0
    container_name: broker-2
    ports:
      - "9093:9093"
    environment:
      KAFKA_NODE_ID: 2
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://broker-2:29092,PLAINTEXT_HOST://localhost:9093'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:29092,CONTROLLER://0.0.0.0:29093,PLAINTEXT_HOST://0.0.0.0:9093'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@broker-1:29093,2@broker-2:29093,3@broker-3:29093'
      CLUSTER_ID: '4L622SOXRZ-haSD5nJ_Tribe'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3

  broker-3:
    image: confluentinc/cp-kafka:7.6.0
    container_name: broker-3
    ports:
      - "9094:9094"
    environment:
      KAFKA_NODE_ID: 3
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://broker-3:29092,PLAINTEXT_HOST://localhost:9094'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:29092,CONTROLLER://0.0.0.0:29093,PLAINTEXT_HOST://0.0.0.0:9094'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@broker-1:29093,2@broker-2:29093,3@broker-3:29093'
      CLUSTER_ID: '4L622SOXRZ-haSD5nJ_Tribe'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local-kraft-cluster
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: broker-1:29092,broker-2:29092,broker-3:29092
```

### 2. Start & Verify
```bash
docker compose up -d
```
Open **`http://localhost:8080`** in your browser. You will see:
- 3 Brokers online (IDs: 1, 2, 3)
- KRaft Controller Quorum active
- Real-time partition distribution view

---

## Step 2: Minimal Spring Boot Kafka Project Setup

Create a Spring Boot 3.x project using [start.spring.io](https://start.spring.io) with:
- Dependencies: **Spring for Apache Kafka (`spring-kafka`)**, **Spring Web**, **Lombok**.

### 1. `application.yml`
```yaml
server:
  port: 8081

spring:
  kafka:
    bootstrap-servers: localhost:9092,localhost:9093,localhost:9094
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: basic-consumer-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
```

### 2. Auto-Create Topic Bean (`KafkaTopicConfig.java`)
```java
package com.example.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic orderEventsTopic() {
        return TopicBuilder.name("order-events")
                .partitions(3)
                .replicas(3) // Hosted on all 3 brokers!
                .build();
    }
}
```

### 3. Basic Producer & Consumer
```java
// Producer Service
@Service
@RequiredArgsConstructor
public class SimpleProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String message) {
        kafkaTemplate.send("order-events", message);
    }
}

// Consumer Service
@Component
@Slf4j
public class SimpleConsumer {

    @KafkaListener(topics = "order-events", groupId = "basic-consumer-group")
    public void consume(String message) {
        log.info("Received message: {}", message);
    }
}
```

---

## Step 3: Witnessing Key-Based Partitioning & Ordering Live

In Note `005`, you learned that `Murmur2(key) % partitions` guarantees that the same key always lands on the same partition. Let's see this in the logs!

### 1. Inspect Headers in the Listener
```java
@Component
@Slf4j
public class KeyInspectingConsumer {

    @KafkaListener(topics = "order-events", groupId = "partition-inspector-group")
    public void listen(
            @Payload String value,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("🎯 Key: [{}], Partition: [{}], Offset: [{}], Value: [{}]", 
                 key, partition, offset, value);
    }
}
```

### 2. Publish Messages via REST Endpoint
```java
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @PostMapping("/send")
    public String sendOrder(@RequestParam String orderId, @RequestParam String status) {
        kafkaTemplate.send("order-events", orderId, "Order status is: " + status);
        return "Dispatched!";
    }
}
```

### 3. Verify in Action:
Call the endpoint 4 times:
```bash
curl -X POST "http://localhost:8081/api/orders/send?orderId=ORD-101&status=CREATED"
curl -X POST "http://localhost:8081/api/orders/send?orderId=ORD-202&status=CREATED"
curl -X POST "http://localhost:8081/api/orders/send?orderId=ORD-101&status=PAID"
curl -X POST "http://localhost:8081/api/orders/send?orderId=ORD-101&status=SHIPPED"
```

**Check your console logs:**
```text
🎯 Key: [ORD-101], Partition: [1], Offset: [0], Value: [Order status is: CREATED]
🎯 Key: [ORD-202], Partition: [2], Offset: [0], Value: [Order status is: CREATED]
🎯 Key: [ORD-101], Partition: [1], Offset: [1], Value: [Order status is: PAID]
🎯 Key: [ORD-101], Partition: [1], Offset: [2], Value: [Order status is: SHIPPED]
```
> [!tip] The "Aha!" Moment
> Notice that all `ORD-101` messages landed strictly on **Partition 1 at Offsets 0, 1, 2 in exact order**. `ORD-202` landed on **Partition 2**. Message ordering per order is strictly preserved!

---

## Step 4: Witnessing Consumer Groups & Rebalancing in Action

In Note `006`, you learned the **1-to-1 Partition Assignment Rule** (1 partition is assigned to at most 1 consumer in a group).

### 1. Configure Concurrency
In `application.yml`, set consumer concurrency to 3:
```yaml
spring:
  kafka:
    listener:
      concurrency: 3 # Creates 3 consumer threads in the same consumer group!
```

### 2. Print Consumer Thread Name
```java
@KafkaListener(topics = "order-events", groupId = "scaling-group")
public void listenWithThreadInfo(
        String message,
        @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {

    log.info("Thread: [{}] consumed from Partition: [{}] -> Message: {}",
             Thread.currentThread().getName(), partition, message);
}
```

### 3. Test Scale & Rebalancing:
1. Start the app. Observe log output:
   - `scaling-group-0-C-1` assigned to `order-events-0`
   - `scaling-group-1-C-1` assigned to `order-events-1`
   - `scaling-group-2-C-1` assigned to `order-events-2`
2. Change concurrency to **4**:
   - Notice that the 4th thread gets **NO partition assigned** and sits completely idle!
3. Kill 1 broker in docker (`docker stop broker-2`):
   - Open Kafka UI (`http://localhost:8080`).
   - Notice an ISR change from `[1,2,3]` to `[1,3]`.
   - The cluster continues working smoothly with zero downtime!

---

## Step 5: Multi-Consumer Groups (The Microservice Broadcast)

Demonstrate how two separate microservices consume the same topic independently:

```java
// Service 1: Payment Microservice
@Component
@Slf4j
public class PaymentConsumer {
    @KafkaListener(topics = "order-events", groupId = "payment-service-group")
    public void processPayment(String event, @Header(KafkaHeaders.OFFSET) long offset) {
        log.info("[Payment Service] Processed offset: {}", offset);
    }
}

// Service 2: Notification Microservice
@Component
@Slf4j
public class NotificationConsumer {
    @KafkaListener(topics = "order-events", groupId = "notification-service-group")
    public void sendEmail(String event, @Header(KafkaHeaders.OFFSET) long offset) {
        log.info("[Notification Service] Sent email for offset: {}", offset);
    }
}
```
*Result:* Both services receive every message. Payment service can be paused or restarted without affecting Notification service!

---

# Part 2: Implementing the Non-Covered Syllabus Topics

---

## Step 6: DTO Event Design, JSON Serialization & Poison Pill Protection (Domain 5.3 & 6.2)

In production, you don't send raw Strings. You send structured JSON DTOs. But what happens if someone publishes bad data (a "Poison Pill") that cannot be deserialized? Standard consumers crash in an infinite restart loop! Here is how to fix it.

### 1. Create Event DTO
```java
package com.example.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private String orderId;
    private String customerId;
    private BigDecimal amount;
    private String status;
    private Instant timestamp;
}
```

### 2. Configure Robust Serializers in `application.yml`
```yaml
spring:
  kafka:
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      # Wrap JsonDeserializer with ErrorHandlingDeserializer to catch Poison Pills!
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer
        spring.json.trusted.packages: "com.example.kafka.dto"
```

### 3. Strongly Typed Consumer
```java
@Component
@Slf4j
public class OrderEventConsumer {

    @KafkaListener(topics = "order-events", groupId = "order-dto-group")
    public void handleOrder(OrderEvent event) {
        log.info("📦 Successfully deserialized OrderEvent: ID={}, Amount={}", 
                 event.getOrderId(), event.getAmount());
    }
}
```

---

## Step 7: Idempotent Consumer & Deduplication (Domain 5.2)

In distributed systems, networks drop ACKs. Kafka guarantees **At-Least-Once** delivery by default, which means **duplicate messages WILL arrive**. Your consumer must be **idempotent**.

### Pattern: Database Deduplication Check
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotentOrderProcessor {

    private final ProcessedEventRepository eventRepo;
    private final OrderRepository orderRepo;

    @Transactional
    public void processOrder(OrderEvent event, String eventId) {
        // 1. Check if we already processed this event ID
        if (eventRepo.existsById(eventId)) {
            log.warn("⚠️ Duplicate event detected! Skipping eventId: {}", eventId);
            return;
        }

        // 2. Perform actual business logic
        Order order = new Order(event.getOrderId(), event.getAmount(), "CONFIRMED");
        orderRepo.save(order);

        // 3. Mark event as processed within the same atomic DB transaction
        eventRepo.save(new ProcessedEvent(eventId, Instant.now()));
        log.info("✅ Order {} saved successfully.", event.getOrderId());
    }
}
```

---

## Step 8: Resilient Error Handling, Non-Blocking Retries & Dead Letter Topics (DLT) (Domain 7.1)

When business processing fails (e.g. third-party Payment API is down), you should **not** block the partition. Use Spring Kafka's `@RetryableTopic` to automatically retry with backoff and route to a **Dead Letter Topic (DLT)** after failures!

```text
[ orders Topic ] 
       |
       v (Fails with 500 error)
[ orders-retry-1000 ]  (Retries after 1 second)
       |
       v (Fails again)
[ orders-retry-2000 ]  (Retries after 2 seconds)
       |
       v (Exhausted all 3 attempts)
[ orders-dlt ]  <=== Dead Letter Topic (Alerts sent to DevOps / PagerDuty!)
```

### Implementation:
```java
@Component
@Slf4j
public class ResilientOrderConsumer {

    @RetryableTopic(
        attempts = "3",
        backoff = @Backoff(delay = 1000, multiplier = 2.0),
        autoCreateTopics = "true",
        dltStrategy = DltStrategy.FAIL_ON_ERROR,
        include = { PaymentGatewayException.class, NetworkTimeoutException.class }
    )
    @KafkaListener(topics = "order-events", groupId = "resilient-group")
    public void processOrder(OrderEvent event) {
        log.info("Attempting to process order: {}", event.getOrderId());
        
        if ("FAIL_ME".equals(event.getStatus())) {
            throw new PaymentGatewayException("Payment gateway is down!");
        }
        
        log.info("Order processed cleanly: {}", event.getOrderId());
    }

    // Handles messages that completely failed all retries
    @DltHandler
    public void handleDlt(OrderEvent event, @Header(KafkaHeaders.ORIGINAL_OFFSET) long origOffset) {
        log.error("🚨 POISON PILL ROUTED TO DLT: OrderId: [{}], Original Offset: [{}]", 
                  event.getOrderId(), origOffset);
        // Alert Slack, PagerDuty, or save to failed_messages table
    }
}
```

---

## Step 9: Distributed Transactions & Exactly-Once Semantics (EOS) (Domain 7.2)

Imagine you must:
1. Consume an order event from `orders`
2. Save the customer record to the Database
3. Publish a `payment-request` event to `payments`

If step 3 fails, steps 1 and 2 must rollback!

### 1. Enable Transactions in `application.yml`
```yaml
spring:
  kafka:
    producer:
      transaction-id-prefix: tx-order-
```

### 2. Transactional Service Implementation
```java
@Service
@RequiredArgsConstructor
public class TransactionalOrderWorkflow {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final OrderRepository orderRepository;

    @Transactional // Executes DB write + Kafka produces in ONE atomic transaction
    @KafkaListener(topics = "order-events", groupId = "tx-processor-group")
    public void processAndForward(OrderEvent event) {
        // 1. Database write
        orderRepository.save(new OrderEntity(event.getOrderId(), "IN_PROGRESS"));

        // 2. Publish to downstream topic
        kafkaTemplate.send("payment-requests", event.getOrderId(), new PaymentRequest(event.getOrderId(), event.getAmount()));

        // If an exception occurs here, the DB rollback happens AND Kafka does not commit the offset or downstream message!
    }
}
```

---

## Step 10: Performance Tuning & High-Throughput Benchmarking (Domain 8.1)

In Domain 8, you learned about batching, linger time, and compression. Let's tune for maximum throughput:

### 1. High-Throughput `application.yml` Settings
```yaml
spring:
  kafka:
    producer:
      acks: all # Durability: wait for all ISR replicas
      properties:
        enable.idempotence: true
        linger.ms: 20           # Wait up to 20ms to fill batches
        batch.size: 65536       # 64 KB batch buffer
        compression.type: snappy # High-speed compression
        max.in.flight.requests.per.connection: 5
    consumer:
      properties:
        fetch.min.bytes: 10240  # 10 KB minimum before broker responds
        fetch.max.wait.ms: 500  # Max wait if min.bytes not reached
```

### 2. Throughput Benchmark Test
```java
@Test
void benchmarkProducerThroughput() {
    long start = System.currentTimeMillis();
    int totalMessages = 50_000;

    for (int i = 0; i < totalMessages; i++) {
        kafkaTemplate.send("order-events", "KEY-" + i, "Benchmarking event payload " + i);
    }
    kafkaTemplate.flush();

    long duration = System.currentTimeMillis() - start;
    log.info("🚀 Sent {} messages in {} ms (Throughput: {} msgs/sec)",
             totalMessages, duration, (totalMessages * 1000L) / duration);
}
```

---

## Step 11: Production Observability: Monitoring Consumer Lag with Prometheus (Domain 8.2)

**Consumer Lag** is the single most critical metric in Kafka production. If lag grows, your consumers are falling behind!

### 1. Add Dependencies to `pom.xml`
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### 2. Enable Actuator in `application.yml`
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  metrics:
    tags:
      application: kafka-order-service
```

### 3. View Consumer Lag Metrics
Run the application and query:
```bash
curl http://localhost:8081/actuator/prometheus | grep kafka_consumer_fetch_manager_records_lag
```
**Sample Metric Output:**
```text
kafka_consumer_fetch_manager_records_lag{client_id="consumer-1",topic="order-events",partition="0"} 0.0
kafka_consumer_fetch_manager_records_lag{client_id="consumer-1",topic="order-events",partition="1"} 42.0
```
*(Partition 1 has 42 unconsumed messages lagging behind!)*

---

## Step 12: Real-Time Stream Processing with Kafka Streams (Domain 9.2)

Build a streaming aggregator that computes the **total sales revenue per minute** in real-time.

### 1. Add `spring-kafka` Streams Dependency
```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-streams</artifactId>
</dependency>
```

### 2. Stream Topology Definition
```java
@Configuration
@EnableKafkaStreams
public class RevenueAnalyticsStreamConfig {

    @Bean
    public KStream<String, OrderEvent> kStream(StreamsBuilder builder) {
        KStream<String, OrderEvent> stream = builder.stream("order-events", 
                Consumed.with(Serdes.String(), new JsonSerde<>(OrderEvent.class)));

        // Windowed aggregation: Total revenue per customer in 1-minute tumbling windows
        stream
            .groupBy((key, order) -> order.getCustomerId(), Grouped.with(Serdes.String(), new JsonSerde<>(OrderEvent.class)))
            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
            .aggregate(
                () -> BigDecimal.ZERO,
                (customerId, order, total) -> total.add(order.getAmount()),
                Materialized.with(Serdes.String(), new CustomBigDecimalSerde())
            )
            .toStream()
            .to("customer-revenue-stats");

        return stream;
    }
}
```

---

## 🎯 Final Practical Checklist: What to Build Step-by-Step

Print or check off this list as you code your project:

- [ ] **Step 1:** Spin up 3-broker KRaft cluster and Kafka UI in Docker Compose.
- [ ] **Step 2:** Create basic Spring Boot project with `KafkaTemplate` and `@KafkaListener`.
- [ ] **Step 3:** Send keyed messages and inspect partition logs to verify Murmur2 hashing live.
- [ ] **Step 4:** Configure 3 consumer threads and witness partition load balancing and rebalance on node crash.
- [ ] **Step 5:** Create multiple consumer groups and witness broadcast consumption.
- [ ] **Step 6:** Migrate to `OrderEvent` DTO with `ErrorHandlingDeserializer` to handle poison pills.
- [ ] **Step 7:** Implement idempotent consumer with DB deduplication check.
- [ ] **Step 8:** Add `@RetryableTopic` with backoff and verify failed messages route to `orders-dlt`.
- [ ] **Step 9:** Test `@Transactional` workflow combining DB write + Kafka publish.
- [ ] **Step 10:** Tune `batch.size`, `linger.ms`, and `snappy` compression, then run throughput benchmark.
- [ ] **Step 11:** Check `/actuator/prometheus` for `records_lag` metrics.
- [ ] **Step 12:** Build a 1-minute tumbling window aggregation with Kafka Streams.

---

## 🧭 Navigation
- **Previous Note:** [[011-Quick_Revision_and_Interview_Guide.md|← 011. Quick Revision & Interview Guide]]
- **Syllabus & Master Tracker:** [[syllabus.md|Apache Kafka Structural Syllabus & Roadmap]]

