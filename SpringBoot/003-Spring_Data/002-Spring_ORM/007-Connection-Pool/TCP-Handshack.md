
---

Imagine you want to call your friend.

```text
You: Hello, can you hear me?
Friend: Yes, I can hear you. Can you hear me?
You: Yes, I can hear you too.
```

Now both sides know:

```text
Communication channel is working.
```

TCP does exactly the same thing.

---

# Why SYN?

Suppose Spring Boot wants to connect to PostgreSQL.

```text
Spring Boot        PostgreSQL
     ?                  ?
```

Neither side knows whether the other is alive.

So Spring Boot sends:

```text
SYN
```

Meaning:

```text
Hey PostgreSQL,
I want to establish a TCP connection.
Are you there?
```

Think of SYN as:

```text
"Can we talk?"
```

---

# Why SYN-ACK?

PostgreSQL receives SYN.

It replies:

```text
SYN-ACK
```

Meaning:

```text
Yes, I received your request.
And I also want to establish a connection.
```

Think:

```text
You: Can we talk?
Friend: Yes, I heard you.
Can you hear me too?
```

Two things happen:

1. PostgreSQL acknowledges your request (ACK)
    
2. PostgreSQL sends its own SYN
    

That's why it's called:

```text
SYN + ACK
```

---

# Why Final ACK?

Spring Boot receives SYN-ACK.

Now it knows:

```text
Server is alive.
```

But PostgreSQL still doesn't know whether its SYN reached Spring Boot.

So Spring Boot sends:

```text
ACK
```

Meaning:

```text
Yes, I received your response.
Connection established.
```

Think:

```text
You: Can we talk?
Friend: Yes, can you hear me?
You: Yes, I can hear you.
```

Now both sides are sure.

---

# Visual Flow

```text
Spring Boot                     PostgreSQL

SYN ------------------------>

      <------------------- SYN + ACK

ACK ------------------------>

TCP Connection Established
```

---

# In HikariCP Startup

When Hikari creates Connection #1:

```text
Hikari
   ↓
PostgreSQL Driver
   ↓
Open Socket
```

Then:

```text
SYN ------------------------>

      <------------------- SYN + ACK

ACK ------------------------>
```

Only after this completes:

```text
TCP Connection Established
```

Then PostgreSQL authentication starts.

---

# Authentication Happens AFTER Handshake

Many developers think:

```text
SYN contains username/password
```

Wrong.

Handshake only establishes the network connection.

After TCP is established:

```text
TCP Connected
      ↓
Send PostgreSQL Protocol Message
      ↓
Send Username
      ↓
Send Password
      ↓
Authentication Success
      ↓
Database Session Created
```

---

# Real Example

Suppose:

```properties
spring.datasource.url=jdbc:postgresql://10.0.0.20:5432/lms
spring.datasource.username=postgres
spring.datasource.password=secret
```

Hikari wants one connection.

Step 1:

```text
Spring Boot -> PostgreSQL

SYN
```

Step 2:

```text
PostgreSQL -> Spring Boot

SYN-ACK
```

Step 3:

```text
Spring Boot -> PostgreSQL

ACK
```

Now:

```text
TCP Connection Established
```

Step 4:

```text
Username = postgres
```

Step 5:

```text
Password = secret
```

Step 6:

```text
Authentication Success
```

Step 7:

```text
Session Created
```

Step 8:

```text
Connection stored in Hikari Pool
```

---
