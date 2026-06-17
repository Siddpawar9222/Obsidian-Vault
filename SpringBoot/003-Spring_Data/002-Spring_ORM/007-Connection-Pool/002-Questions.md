
----


## How authentications happen ? 

If HikariCP creates **10 physical database connections**, then **10 separate authentications happen**.

Think of it this way:

```text
Spring Boot
    ↓
Hikari Pool
    ├── Conn1
    ├── Conn2
    ├── Conn3
    ├── Conn4
    ├── Conn5
    ├── Conn6
    ├── Conn7
    ├── Conn8
    ├── Conn9
    └── Conn10
```

Each connection is a completely independent database session.

For every connection:

```text
TCP Handshake
    ↓
Username Sent
    ↓
Password Verification
    ↓
Session Created
```

So internally:

```text
Conn1 → Authenticate
Conn2 → Authenticate
Conn3 → Authenticate
...
Conn10 → Authenticate
```

---

## Why does every connection need authentication?

Because from PostgreSQL's perspective:

```text
Connection #1
Connection #2
Connection #3
...
```

are different clients.

PostgreSQL doesn't know they belong to the same Spring Boot application.

For PostgreSQL:

```text
Client A connected
Client B connected
Client C connected
```

Each client must prove:

```text
Who are you?
Are you allowed to connect?
```

Hence authentication for every new physical connection.

---

## Then won't startup become slow?

Yes.

Suppose:

```properties
spring.datasource.hikari.minimum-idle=50
```

At startup Hikari may create 50 connections.

That means:

```text
50 TCP Handshakes
50 Authentications
50 Sessions
```

This is one reason why applications sometimes take a few seconds longer to start.

---

## Does authentication happen on every request?

This is the most important point.

**No.**

Authentication happens only when a **new physical connection** is created.

Example:

Startup:

```text
Create Conn1 → Authenticate
Create Conn2 → Authenticate
...
Create Conn10 → Authenticate
```

Now pool is ready.

Request #1:

```text
Borrow Conn3
Run Query
Return Conn3
```

No authentication.

Request #2:

```text
Borrow Conn7
Run Query
Return Conn7
```

No authentication.

Request #50000:

```text
Borrow Conn1
Run Query
Return Conn1
```

Still no authentication.

Because the connection already exists.

---

## What if PostgreSQL restarts?

Suppose:

```text
Spring Boot Running
PostgreSQL Running
```

Then PostgreSQL crashes and restarts.

All existing sessions die.

```text
Conn1 ❌
Conn2 ❌
Conn3 ❌
...
```

Hikari detects broken connections.

Then it creates new ones:

```text
New Conn1
New Conn2
New Conn3
...
```

And for each new connection:

```text
TCP Handshake
Authentication
Session Creation
```

happens again.

---

If someone asks:

> "Pool size is 10. How many database sessions exist?"

Answer:

```text
Up to 10 active PostgreSQL sessions.
```

And:

> "How many authentications happen?"

Answer:

```text
One authentication per physical connection.
So approximately 10 authentications when those
10 connections are created.
```

After that, thousands or millions of requests can reuse those authenticated connections without re-authenticating every time.


---


## What will happens if we changed Password in PostgreSQL 

---

# Scenario 1: Password Changed in PostgreSQL

Suppose current configuration:

```properties
spring.datasource.username=postgres
spring.datasource.password=oldPassword
```

Hikari already has:

```text
Conn1 ✓
Conn2 ✓
Conn3 ✓
...
Conn10 ✓
```

All 10 connections are authenticated and active.

Now DBA executes:

```sql
ALTER USER postgres
WITH PASSWORD 'newPassword';
```

---

## What happens to existing connections?

Usually **nothing immediately**.

Those 10 sessions are already authenticated.

```text
PostgreSQL
    ↓
Session already established
```

PostgreSQL does not continuously re-check the password.

Therefore:

```text
Conn1 ✓ Still works
Conn2 ✓ Still works
Conn3 ✓ Still works
...
```

Existing queries continue to work.

---

## What happens when Hikari creates a new connection?

Suppose later:

```text
Conn5 dies
```

or

```text
Application needs Conn11
```

Hikari tries:

```java
DriverManager.getConnection(
    url,
    "postgres",
    "oldPassword"
);
```

Now PostgreSQL checks credentials.

```text
Username = postgres
Password = oldPassword
```

But database expects:

```text
newPassword
```

Result:

```text
Authentication Failed
```

You will see errors like:

```text
FATAL: password authentication failed
```

New connection creation fails.

---

# Scenario 2: Existing Connections Eventually Expire

Suppose:

```text
10 connections active
Password changed
```

Initially:

```text
All 10 continue working
```

But over time:

```text
Conn1 closed
Conn2 closed
Conn3 closed
...
```

Hikari attempts to recreate them.

Every recreation fails.

Eventually:

```text
Pool Size = 0
```

Then:

```text
No database connections available
```

Application becomes unusable.

---

# Timeline Example

```text
09:00
Pool Size = 10
Password = oldPassword
```

---

```text
10:00
DBA changes password
```

Current sessions still alive.

Application appears healthy.

---

```text
11:00
Some connections expire
```

Hikari:

```text
Create New Connection
```

Result:

```text
Authentication Failed
```

Pool shrinks.

---

```text
12:00
All old connections gone
```

Pool:

```text
0 Connections
```

Application starts throwing:

```text
Cannot get JDBC Connection
```

errors.

---

# Scenario 3: Username Revoked

Suppose DBA does something drastic:

```sql
ALTER ROLE postgres NOLOGIN;
```

or

```sql
DROP USER postgres;
```

Again:

### Existing Sessions

Often continue working until disconnected.

### New Sessions

Fail immediately.

---

# Why Does PostgreSQL Allow Existing Sessions?

Think of logging into Gmail.

```text
Login with password
      ↓
Session created
      ↓
Receive session token
```

If you change your password:

```text
Existing browser session
```

may continue working.

But:

```text
New login attempt
```

requires the new password.

Database sessions behave similarly.

---

# What About Spring Boot?

Spring Boot does not automatically know:

```text
Password changed
```

It only discovers the problem when:

```text
New Connection Needed
```

and authentication fails.

---

# How Do Companies Rotate Passwords Safely?

Common approach:

### Step 1

Create new password.

### Step 2

Update:

```properties
spring.datasource.password=newPassword
```

or update secret in:

- AWS Secrets Manager
    
- HashiCorp Vault
    
- Kubernetes Secrets
    

### Step 3

Restart application instances one by one.

Each instance creates new authenticated sessions.

No downtime.

---

# Interview Answer

If asked:

> What happens if DB credentials change while HikariCP already has active connections?

A strong answer is:

```text
Existing authenticated database sessions usually
continue to work because PostgreSQL does not
re-authenticate an already established connection.

However, any new connection created by HikariCP
will use the old credentials and fail authentication.

As existing connections are closed and replaced,
the connection pool gradually shrinks until the
application can no longer obtain database
connections unless the application configuration
is updated and restarted.
```

This is exactly how it behaves in most PostgreSQL and MySQL production systems.

--- 
