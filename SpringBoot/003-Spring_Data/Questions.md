
---

<font color="#ffc000"> JPA: Only for relational database not  for non-relational</font>


```java
@PersistenceContext
private EntityManager entityManager;
```

@PersistenceContext gives
EntityManager associated with the current transaction and thread.


---

# # Spring Boot Database Cheat Sheet 

| Database          | Spring Boot Starter                      | Main Config Key                   | Repository Interface            |
| ----------------- | ---------------------------------------- | --------------------------------- | ------------------------------- |
| **MySQL**         | `spring-boot-starter-data-jpa`           | `spring.datasource.url`           | `JpaRepository`                 |
| **PostgreSQL**    | `spring-boot-starter-data-jpa`           | `spring.datasource.url`           | `JpaRepository`                 |
| **Oracle**        | `spring-boot-starter-data-jpa`           | `spring.datasource.url`           | `JpaRepository`                 |
| **MongoDB**       | `spring-boot-starter-data-mongodb`       | `spring.data.mongodb.uri`         | `MongoRepository`               |
| **Redis**         | `spring-boot-starter-data-redis`         | `spring.redis.host`               | `RedisRepository`               |
| **Elasticsearch** | `spring-boot-starter-data-elasticsearch` | `spring.elasticsearch.uris`       | `ElasticsearchRepository`       |
| **Cassandra**     | `spring-boot-starter-data-cassandra`     | `spring.cassandra.contact-points` | `CassandraRepository`           |
| **Neo4j**         | `spring-boot-starter-data-neo4j`         | `spring.neo4j.uri`                | `Neo4jRepository`               |
| **Kafka**         | `spring-kafka`                           | `spring.kafka.bootstrap-servers`  | (No repository, uses templates) |
| **RabbitMQ**      | `spring-boot-starter-amqp`               | `spring.rabbitmq.host`            | (No repository)                 |
| **InfluxDB**      | `influxdb-client-java`                   | Custom config                     | Custom client                   |
| **S3 / MinIO**    | AWS SDK / MinIO SDK                      | Custom                            | Custom client                   |