Secret Rotation

---

# First, what is Secret Rotation?

Imagine your database password is:

```text
password123
```

Your Spring Boot application uses it to connect to PostgreSQL.

After one year, your security team says:

> "We should change the password because it might have been leaked."

Changing passwords manually every few months is called **manual rotation**.

AWS can do this automatically.

That's called **Automatic Secret Rotation**.

---

# Why do companies rotate secrets?

Suppose someone accidentally leaks your password.

```text
DB Password

↓

password123

↓

Someone copies it
```

Even if the attacker doesn't use it today, they can use it six months later.

If passwords are rotated regularly:

```text
January

password123

↓

February

xJ9#L1$P

↓

March

T@8fdK2!

↓

April

Qz91@Lp8
```

The old password becomes useless.

This greatly reduces the impact of leaked credentials.

---

# Without Rotation

Imagine this timeline.

```text
January

DB Password = password123

↓

Spring Boot connects

↓

Works
```

After one year...

```text
Still

password123
```

Nothing changed.

If someone knows this password, they can continue using it.

---

# With Rotation

Timeline

```text
January

password123

↓

February

ASD89#@1

↓

March

Pq!90Lm$

↓

April

Hj2@Op89
```

Your application never knows these passwords in advance.

It simply asks AWS Secrets Manager each time it starts (or refreshes, depending on your implementation).

---

# But Who Changes the Password?

This is the interesting part.

AWS Secrets Manager **does not magically know how to change your database password**.

Something must actually perform the change.

That "something" is a **Lambda function**.

That's why your screen asks for a **Rotation Function**.

---

# Architecture

```text
          AWS Secrets Manager
                    │
                    │
         "Rotate this secret"
                    │
                    ▼
            Lambda Function
                    │
                    │
     Connect to PostgreSQL
                    │
                    ▼
ALTER USER postgres
WITH PASSWORD 'NewPassword123';
                    │
                    ▼
Update Secrets Manager
                    │
                    ▼
Secret now contains
NewPassword123
```

The Lambda function is responsible for changing the password both in the database and in Secrets Manager.

---

# Let's See a Real Example

Current Secret

```json
{
  "dbUsername": "postgres",
  "dbPassword": "password123"
}
```

Database

```text
postgres

password123
```

Everything matches.

---

Rotation Starts

AWS says:

> "Time to rotate."

It invokes the Lambda function.

---

## Step 1

Lambda generates a random password.

Example

```text
F@9kLp#82x
```

---

## Step 2

Lambda connects to PostgreSQL.

Runs

```sql
ALTER USER postgres
WITH PASSWORD 'F@9kLp#82x';
```

Now PostgreSQL password changed.

---

## Step 3

Lambda updates Secrets Manager.

Old

```json
{
 "dbPassword":"password123"
}
```

New

```json
{
 "dbPassword":"F@9kLp#82x"
}
```

---

Now both are synchronized.

```text
Database

↓

F@9kLp#82x

↓

Secrets Manager

↓

F@9kLp#82x
```

Everything works.

---

# What Happens to Spring Boot?

Suppose your application is already running.

It still has

```text
password123
```

inside its connection pool.

Nothing immediately breaks because existing database connections remain valid.

When the application needs to create **new connections**, it must use the new password.

This is why applications usually:

* restart,
* refresh their datasource,
* or fetch updated secrets dynamically.

Many production systems schedule rotations during maintenance windows or implement secret refresh to avoid disruption.

---

# Why Does AWS Ask for a Lambda?

Because every service rotates differently.

For PostgreSQL

```sql
ALTER USER
```

For MySQL

```sql
ALTER USER
```

For Oracle

Different SQL.

For MongoDB

Different command.

AWS cannot know how your system works.

So **you provide the logic**.

---

# What Does the Lambda Actually Do?

A simplified flow:

```text
Receive Rotation Request

↓

Read Current Secret

↓

Generate New Password

↓

Connect to Database

↓

Update Database Password

↓

Verify Login Works

↓

Update Secret in Secrets Manager

↓

Return Success
```

---

# Does AWS Provide the Lambda?

Yes.

For many AWS-managed databases such as **Amazon RDS** (PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, etc.), AWS provides **prebuilt rotation Lambda templates**. You don't have to write the logic yourself.

For custom databases or third-party systems, you usually write your own rotation Lambda.

---

# What About Your Spring Boot Application?

Your application **does not participate in the rotation process**.

It simply consumes whatever value exists in Secrets Manager.

```text
Spring Boot

↓

Reads Secret

↓

Connects to Database
```

It doesn't know:

* who changed the password,
* when it changed,
* or how it changed.

It only cares that the secret is valid.

---

# Should You Enable Rotation in Your POC?

**No.**

For learning, keep it simple.

Your POC should focus on:

* Creating secrets
* Reading them from Spring Boot
* Understanding IAM permissions
* Using different secrets for `local`, `dev`, `test`, and `prod`

Once you're comfortable with that, you can explore rotation as a separate topic.

---

# What Happens in Large Companies?

A typical production flow looks like this:

```text
Spring Boot Application
        │
        ▼
AWS Secrets Manager
        │
        ▼
Automatic Rotation (every 90 days)
        │
        ▼
AWS Lambda
        │
        ▼
Database Password Updated
        │
        ▼
Secrets Manager Updated
        │
        ▼
Application refreshes or restarts and begins using the new password
```

This separation of responsibilities is important:

* **Secrets Manager** securely stores secrets.
* **Lambda** performs the rotation.
* **IAM** controls who can read or rotate secrets.
* **Spring Boot** simply reads the current secret and uses it. It doesn't need to know how the secret was generated or rotated.

This separation is one of the reasons AWS Secrets Manager fits well into production environments.
