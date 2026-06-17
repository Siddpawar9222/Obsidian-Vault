
---

# Life Before Connection Pools

Suppose your Spring Boot application receives a request:

```http
GET /employees/1
```

Your code executes:

```java
Connection con =
 DriverManager.getConnection(url, user, password);
```

Then:

```java
PreparedStatement ps = ...
ResultSet rs = ...
```

Finally:

```java
con.close();
```

Request completed.

---

## What happens internally?

Creating a database connection is **very expensive**.

When MySQL/PostgreSQL receives a new connection:

1. Open TCP socket
    
2. Authenticate user
    
3. Allocate memory
    
4. Create DB session
    
5. Initialize transaction state
    
6. Setup security context
    

This can take:

```text
5ms
10ms
50ms
100ms
```

depending on network and database load.

---

## Imagine 1000 Requests

Without pooling:

```text
Request 1 -> Create Connection
Request 2 -> Create Connection
Request 3 -> Create Connection
...
Request 1000 -> Create Connection
```

Database keeps creating and destroying connections.

Huge overhead.

---

## Real Problem

Suppose connection creation takes:

```text
50ms
```

Actual query execution takes:

```text
5ms
```

You spend:

```text
50ms creating connection
5ms doing work
```

90% of time is wasted.

---

# Solution: Connection Pool

Instead of creating connections every time:

```text
Create 10 connections once
Keep them ready
Reuse them
```

Like:

```text
Pool
 ├─ Connection 1
 ├─ Connection 2
 ├─ Connection 3
 ├─ Connection 4
 ├─ Connection 5
 └─ ...
```

When request arrives:

```text
Request
   ↓
Borrow Connection
   ↓
Execute Query
   ↓
Return Connection
```

Connection is NOT destroyed.

It goes back to pool.

---

# What is HikariCP?

HikariCP is a **high-performance JDBC connection pool**.

It manages:

```text
Database Connections
```

for your Spring Boot application.

---

## Why Name Hikari?

"Hikari" means:

```text
Light
```

in Japanese.

The library focuses on:

```text
Fast
Lightweight
Efficient
```

connection pooling.

---

# Spring Boot Uses HikariCP By Default

When you add:

```xml
spring-boot-starter-data-jpa
```

or

```xml
spring-boot-starter-jdbc
```

Spring Boot automatically creates:

```text
HikariDataSource
```

unless configured otherwise.

That's why during startup you see logs like:

```text
HikariPool-1 - Starting...
HikariPool-1 - Added connection
HikariPool-1 - Start completed
```

---

# What Happens During Startup?

Suppose configuration is:

```properties
spring.datasource.url=...
```

Spring Boot creates:

```text
HikariDataSource
```

Internally:

```text
HikariPool
    ↓
Create connections
    ↓
Store in pool
```

Something like:

```text
Pool
 ├─ Conn1
 ├─ Conn2
 ├─ Conn3
 ├─ Conn4
 └─ Conn5
```

ready before requests arrive.

---

# Request Flow

Suppose:

```java
employeeRepository.findById(id);
```

Internally:

```text
Repository
   ↓
Hibernate
   ↓
DataSource
   ↓
HikariCP
   ↓
Database Connection
```

The repository never creates connections directly.

Hikari provides one from the pool.

---

# Why Not Use One Connection Forever?

Many threads may execute simultaneously.

Example:

```text
User A Request
User B Request
User C Request
User D Request
```

One connection cannot serve all at the same time.

We need multiple connections.

Hence:

```text
Pool of Connections
```

instead of:

```text
Single Connection
```

---

# Important Configuration

## Maximum Pool Size

```properties
spring.datasource.hikari.maximum-pool-size=20
```

Means:

```text
Maximum 20 DB connections
```

can exist.

---

## Minimum Idle

```properties
spring.datasource.hikari.minimum-idle=5
```

Keep at least:

```text
5 ready connections
```

even when traffic is low.

---

## Connection Timeout

```properties
spring.datasource.hikari.connection-timeout=30000
```

If pool is exhausted:

```text
Wait 30 seconds
```

for a free connection.

After that:

```text
SQLTransientConnectionException
```

is thrown.

---

# Common Production Issue

Suppose:

```text
Pool Size = 10
```

and:

```text
100 requests arrive
```

Only:

```text
10 requests
```

get connections immediately.

Remaining:

```text
90 requests
```

wait.

If waiting exceeds timeout:

```text
Connection is not available,
request timed out
```

error occurs.

This is one of the most common production issues.

---

# How Does `close()` Work With Hikari?

This confuses many developers.

When Hibernate/JDBC calls:

```java
connection.close();
```

the connection is usually **not actually closed**.

Hikari intercepts it.

```text
close()
   ↓
Return connection to pool
```

Physical DB connection remains alive.

That's how reuse works.

---

# Internal Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Hibernate
    ↓
DataSource
    ↓
HikariCP
    ↓
JDBC Connection
    ↓
PostgreSQL/MySQL
```

Whenever Hibernate needs a connection:

```java
dataSource.getConnection()
```

Hikari checks:

```text
Any free connection?
```

If yes:

```text
Give connection
```

Otherwise:

```text
Wait
```

or create a new one (if below max pool size).

---

# Why HikariCP Became Industry Standard

Before HikariCP, people commonly used:

- Apache DBCP
    
- C3P0
    

Problems:

```text
Higher memory usage
Slower
More locking
Lower throughput
```

HikariCP was designed to be:

```text
Extremely fast
Low latency
Less garbage creation
Simple
```

So today most Spring Boot applications use HikariCP by default.

---

# Summary :

You don't need to memorize HikariCP internals, but you should understand:

✅ Why creating DB connections is expensive

✅ What a connection pool is

✅ HikariCP is Spring Boot's default connection pool

✅ `connection.close()` usually returns connection to pool

✅ Pool size directly affects application throughput

✅ Too many DB connections can overload the database

✅ Too few connections can cause request waiting and timeouts

The key takeaway:

```text
HikariCP is a connection manager.

Its job is to create a small number of database
connections, keep them alive, and efficiently
reuse them across thousands of requests.
```

---


