# Serialization, Deserialization and Event Schemas

> [!abstract] Learning status
> **Covered:** why Kafka stores bytes, serializer/deserializer responsibilities, key vs value serialization, JSON conversion, Java DTO mapping, field-name mismatch behavior, Spring Kafka JSON serializer/deserializer configuration, `KafkaTemplate`, and `@KafkaListener` message conversion flow.
>
> **Still to study:** headers and timestamps in practice, custom serializers, poison-pill handling, schema evolution, compatibility modes, Avro, and Schema Registry.

## Why serialization is required

Kafka stores and transfers record keys and values as byte arrays. It does not store a live Java object and does not understand Java classes or JSON fields.

A Java application must convert its data to bytes before sending it. A consuming application converts those bytes back into a usable value.

## Serializer and deserializer

- **Serialization:** converting a value into bytes before publishing.
- **Deserialization:** converting bytes back into a value after consuming.

```text
Producer application
Java Order DTO
     |
     v
Serializer
     |
     v
byte[] --------------------> Kafka
                                |
                                v
Consumer application       byte[]
                                |
                                v
                          Deserializer
                                |
                                v
                         Java Order DTO
```

## JSON serialization has two conceptual steps

Suppose the producer has:

```java
Order order = new Order(101L, "CREATED", 2500.0);
```

A JSON serializer converts the object's fields into JSON data:

```json
{
  "orderId": 101,
  "status": "CREATED",
  "amount": 2500.0
}
```

The JSON text is then encoded into bytes, commonly using UTF-8. Those bytes are what Kafka transports and stores.

On the consumer side, the bytes are decoded and parsed into the target Java type.

## Key serializer vs value serializer

A Kafka record has a key and a value. Both are serialized independently.

Example:

```java
kafkaTemplate.send("orders", "order-101", order);
```

| Record part | Example | Serializer |
|---|---|---|
| Key | `"order-101"` | `StringSerializer` |
| Value | `Order` object | `JsonSerializer` |

The key matters for partition routing. The producer serializes the key, and the partitioner uses the key's serialized representation to determine the partition. With the same key and an unchanged partitioning setup, related records are routed consistently.

The value contains the business event data.

## Spring Boot producer configuration

Example configuration for a Spring Kafka producer:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:29092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

Responsibilities:

- `StringSerializer` converts the key String into bytes.
- `JsonSerializer` converts the Java value object into JSON bytes.
- `KafkaTemplate` provides the send API and delegates serialization to the configured Kafka producer serializers.

Example:

```java
kafkaTemplate.send("orders", "order-101", order);
```

The application does not manually convert the DTO to a byte array in this flow.

## Spring Boot consumer configuration

Example:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:29092
    consumer:
      group-id: payment-service-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "com.example.orders.dto"
```

Responsibilities:

- `StringDeserializer` converts key bytes into a String.
- `JsonDeserializer` converts JSON bytes into a Java object.
- `trusted.packages` restricts which packages are trusted for JSON deserialization. Prefer a narrow package list rather than trusting all packages.

**Important:** producer and consumer must agree on a compatible message format and target data structure.

## Receiving a DTO with `@KafkaListener`

Example:

```java
@Component
public class PaymentConsumer {

    @KafkaListener(
        topics = "orders",
        groupId = "payment-service-group"
    )
    public void consume(Order order) {
        System.out.println(order.getOrderId());
        System.out.println(order.getStatus());
    }
}
```

The method receives an `Order` object because the consumer's configured deserializer converts the incoming bytes before the listener method is invoked.

Conceptual flow:

```text
Kafka broker
    |
    v
Kafka consumer poll()
    |
    v
Deserializer converts value bytes to Order
    |
    v
Spring Kafka listener container
    |
    v
@KafkaListener method receives Order
```

`@KafkaListener` does not mean Kafka pushes records into the application. Spring Kafka manages the consumer polling loop and invokes the listener when records are available.

## JSON field-name mismatch

Incoming JSON:

```json
{
  "orderId": 101,
  "status": "CREATED",
  "amount": 2500.0
}
```

Consumer DTO:

```java
public class Order {
    private Long orderId;
    private String status;
    private Double totalAmount;
}
```

In a typical Jackson mapping, the JSON field `amount` does not automatically populate the Java field `totalAmount`. The `totalAmount` field can remain `null` (assuming a nullable wrapper type and no custom mapping). This mismatch does not necessarily make deserialization fail.

Use a consistent field name, or map the JSON name explicitly:

```java
@JsonProperty("amount")
private Double totalAmount;
```

## Event contract between microservices

JSON structure is a contract between the producer and its consumers.

Example:
- Order Service publishes `ORDER_CREATED`.
- Payment Service consumes the event and processes payment.
- Notification Service consumes the same event and sends a notification.

Each service needs to understand the event structure. Renaming or removing fields can break consumers or silently produce missing values.

Good event-design practices to study and apply:
- Use clear event names such as `OrderCreated`.
- Include a stable event ID and business identifier.
- Prefer additive, backward-compatible schema changes.
- Avoid changing the meaning of an existing field.
- Version event contracts deliberately when breaking changes are unavoidable.

## Multiple consumer groups and the same event

If Payment Service uses `payment-service-group` and Notification Service uses `notification-service-group`, both groups can independently consume the same event from the topic.

Each group maintains its own offsets. Within one group, partitions are load-balanced among its consumer instances.

## Key revision points

- Kafka transports bytes, not Java objects.
- Serializer converts data to bytes; deserializer converts bytes back.
- Key and value have separate serializers/deserializers.
- The key can control partition routing; the value carries event data.
- `KafkaTemplate` delegates serialization to the configured producer serializer.
- `JsonDeserializer` converts incoming JSON bytes to the target Java DTO.
- `@KafkaListener` receives the deserialized object through Spring Kafka's listener container.
- Producer and consumer event schemas must remain compatible.

## Topics still pending in this module

- Kafka record headers and timestamps.
- Custom serializers and deserializers.
- ErrorHandlingDeserializer and poison-pill messages.
- Schema evolution and compatibility.
- Backward, forward, and full compatibility.
- Avro and Schema Registry.
