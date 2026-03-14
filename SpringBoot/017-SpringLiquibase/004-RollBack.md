
---

## How RollBack Works


# 1️⃣ First you write the rollback SQL

Example changelog:

```sql
-- liquibase formatted sql  
  
-- changeset siddhesh-liquibase-01:13-march  
ALTER TABLE spring_liquibase_student ADD COLUMN class VARCHAR(10) DEFAULT 'XI';  
-- rollback ALTER TABLE spring_liquibase_student DROP COLUMN class;  
  
  
  
-- changeset siddhesh-liquibase-02:14-march  
ALTER TABLE spring_liquibase_student ADD COLUMN gender VARCHAR(10) DEFAULT 'MALE';  
-- rollback ALTER TABLE spring_liquibase_student DROP COLUMN gender;
```

Here you are telling Liquibase:

> If I ever rollback this changeset, run this SQL:
> 
> `ALTER TABLE spring_liquibase_student DROP COLUMN gender`

So this line is **just an instruction stored for future use**.

It does **NOT execute automatically**.

---

# 2️⃣ Now the application runs normally

When Spring Boot starts:

Liquibase runs:

```
update
```

So this SQL runs:

```sql
ALTER TABLE spring_liquibase_student ADD COLUMN gender VARCHAR(10) DEFAULT 'MALE'; 
```

Now database looks like:

```
student
 id
 name
 gender
```

And Liquibase stores this in table:

```
DATABASECHANGELOG
```

---

# 3️⃣ Now imagine something broke in production 🚨

Maybe that column caused problems.

Now you want to **undo the last change**.

So you run this command manually:

```bash
mvn liquibase:rollback -Dliquibase.rollbackCount=1
```

---

# 4️⃣ What Liquibase does internally

Liquibase checks this table:

```
DATABASECHANGELOG
```

It finds the **last executed changeset**.

Example:

```
1  siddhesh
```

Then it looks inside your changelog file and finds the rollback SQL:

```
-- rollback ALTER TABLE student DROP COLUMN gender;
```

Then Liquibase executes:

```sql
ALTER TABLE student DROP COLUMN gender;
```

Now database becomes:

```
student
 id
 name
```

Column removed.

---

# 5️⃣ Very simple analogy

Think of it like this:

|Step|What you do|
|---|---|
|Write rollback SQL|Define **how to undo change**|
|Run update|Apply database change|
|Run rollback command|Execute undo SQL|

---

# 6️⃣ Important point

Spring Boot automatically runs:

```
liquibase update
```

But **rollback is NEVER automatic**.

Because rollback may:

- delete tables
    
- delete columns
    
- delete data
    

So developer must **manually trigger rollback**.

---

# Final simple flow

```
Write changeset + rollback
        ↓
Spring Boot starts
        ↓
Liquibase UPDATE runs
        ↓
Change applied
        ↓
Problem happens
        ↓
Developer runs rollback command
        ↓
Rollback SQL executes
```

---

## RollBack Sequence

Your changesets:

```sql
-- changeset siddhesh-liquibase-02:002
ALTER TABLE spring_liquibase_student ADD COLUMN class VARCHAR(10) DEFAULT 'XI';
-- rollback ALTER TABLE spring_liquibase_student DROP COLUMN class;

-- changeset siddhesh-liquibase-03:003
ALTER TABLE spring_liquibase_student ADD COLUMN gender VARCHAR(10) DEFAULT 'MALE';
-- rollback ALTER TABLE spring_liquibase_student DROP COLUMN gender;
```

Execution order was:

1. changeset **002** → add `class`
    
2. changeset **003** → add `gender`
    

Database now:

```
student
id
name
class
gender
```

---

# Important Liquibase Rule

Liquibase **rolls back in reverse order only** (LIFO – Last In First Out).

So it behaves like a **<font color="#ffc000">stack</font>**.

```
003  ← latest
002
```

Because of this rule:

❌ You **cannot rollback 002 directly** while 003 is still applied.

---

# Correct way to rollback `class`

You must rollback **003 first**, then **002**.

### Step 1 — rollback gender

```bash
mvn liquibase:rollback -Dliquibase.rollbackCount=1
```

Liquibase runs:

```sql
ALTER TABLE spring_liquibase_student DROP COLUMN gender;
```

Database now:

```
student
id
name
class
```

---

### Step 2 — rollback class

```bash
mvn liquibase:rollback -Dliquibase.rollbackCount=1
```

Liquibase runs:

```sql
ALTER TABLE spring_liquibase_student DROP COLUMN class;
```

---

# Alternative (Advanced) – Rollback to a tag

If you tagged after 002:

```bash
mvn liquibase:tag -Dliquibase.tag=before_gender
```

Then you can rollback to that tag:

```bash
mvn liquibase:rollback -Dliquibase.rollbackTag=before_gender
```

Liquibase will rollback **everything after that tag**.

---

# What developers usually do in real projects

If you want to remove **only `class` but keep `gender`**, you **do not rollback**.

Instead you create a **new changeset**.

Example:

```sql
-- changeset siddhesh-liquibase-04:004
ALTER TABLE spring_liquibase_student DROP COLUMN class;
```

Liquibase philosophy:

```
Never modify history.
Always create new migrations.
```

Just like **Git commits**.

---

# Best Practice (Very Important)

Production teams almost always do this:

❌ Avoid rollbacks  
✅ Create new corrective migration

Example:

```
002 add class
003 add gender
004 drop class
```

---
