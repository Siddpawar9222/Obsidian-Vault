
---

# 1. **ChangeLog**

A **ChangeLog** is the **main file that contains all database changes**.

Think of it like a **Git history file for your database**.

It tells Liquibase:

> "These are the database changes that must be applied."

### Example (SQL)

```sql
-- liquibase formatted sql

-- changeset siddhesh:1
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100)
);
```

So the **changelog = collection of database changes**.

---

# 2. **ChangeSet**

A **ChangeSet** is the **smallest unit of change** in Liquibase.

Think of it like a **Git commit**.

Each ChangeSet:

- Has an **id**
    
- Has an **author**
    
- Contains the **SQL change**
    

### Example

```sql
-- changeset siddhesh:1
CREATE TABLE student (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100)
);
```

Here:

- `siddhesh` → author
    
- `1` → change id
    

Liquibase uses this combination to track if it was already executed.

---

# 3. **DATABASECHANGELOG Table**

Liquibase automatically creates this table.

It stores **which changesets were already executed**.

Example content:

|id|author|filename|dateexecuted|
|---|---|---|---|
|1|siddhesh|changelog.sql|2025-03-10|

So when Liquibase runs again, it checks:

> "Did I already run changeset 1?"

If yes → **skip**

---

# 4. **DATABASECHANGELOGLOCK Table**

This table prevents **multiple Liquibase executions at the same time**.  

Example :  
 When Multiple Servers Start at the Same Time (Most Common Case) 

```
Load Balancer
      │
 ┌────┴────┐
App Server 1
App Server 2
App Server 3
```


All servers start at the same time.

Each server tries to run Liquibase migration during startup.

Example flow:

1️⃣ Server 1 starts  
2️⃣ Server 2 starts  
3️⃣ Server 3 starts

All three try to execute:

```
Liquibase update
```

Without locking, this could happen:

```
Server 1 → CREATE TABLE users  
Server 2 → CREATE TABLE users  
Server 3 → CREATE TABLE users
```

💥 Database error.

To prevent this:

Server 1 sets:

```
DATABASECHANGELOGLOCK  
locked = true
```

Now:

- Server 2 waits
    
- Server 3 waits
    

When Server 1 finishes migration:

`locked = false`

Now other servers start normally.


Example:

| id  | locked |
| --- | ------ |
| 1   | false  |

When Liquibase starts migration:

```
locked = true
```

When it finishes:

```
locked = false
```

This prevents **two servers running migration at the same time**.

---

# 5. **Context**

Context allows running changes **only in specific environments**.

Example:

- run in **dev**
    
- skip in **production**
    

### Example

```sql
-- changeset siddhesh:2 context:dev
INSERT INTO users VALUES (1, 'Test User');
```

Run command:

```
mvn liquibase:update -Dliquibase.contexts=dev
```

Result:

- runs in dev
    
- skipped in prod
    

Very useful for:

- test data
    
- debugging tables
    

---

# 6. **Label**

Labels are similar to contexts but used for **grouping features**.

Example:

```xml
<changeSet id="3" author="siddhesh" labels="feature-user-module">
```

You can run only changes related to that feature.

---

# 7. **Rollback**

Rollback means **undoing a database change**.

Example:

```xml
<changeSet id="4" author="siddhesh">
    <createTable tableName="test_table">
        <column name="id" type="int"/>
    </createTable>

    <rollback>
        DROP TABLE test_table;
    </rollback>
</changeSet>
```

If needed, Liquibase can revert that change.

---

# 8. **changelogSync**

Used when you **introduce Liquibase into an existing production DB**.

It tells Liquibase:

> "All these changes already exist. Just mark them as executed."

Command:

```
mvn liquibase:changelogSync
```

It **does NOT execute SQL**.

---

# 9. **generateChangeLog**

Used to **generate Liquibase changelog from an existing database schema**.

Command:

```
mvn liquibase:generateChangeLog
```

Liquibase reads your DB and creates migration files.

Useful when adopting Liquibase in old projects.

---

# 10. **update**

This command **applies new database changes**.

Command:

```
mvn liquibase:update
```

Liquibase will:

1. Check `DATABASECHANGELOG`
    
2. Find new changesets
    
3. Execute them
    

---

# 11. **Master Changelog**

This is the **main entry file** that includes all migrations.

Example:

```
db.changelog-master.xml
```

Example:

```xml
<databaseChangeLog>
     <include file="/db/changelog/changes/001-alter-student.sql"/>
     <include file="/db/changelog/changes/002-rename-student.sql"/>
</databaseChangeLog>
```

This helps organize migrations.

---

# 12. **Baseline / Initial Schema**

When Liquibase is introduced to an **existing project**, we generate:

```
001-initial-schema.sql
```

This represents the **current database structure**.

Then we run:

```
mvn liquibase:changelogSync
```

to mark it as executed.

---

# ⭐ Most Important Liquibase Terms (Quick List)

|Term|Meaning|
|---|---|
|ChangeLog|File containing database migrations|
|ChangeSet|Single database change|
|DATABASECHANGELOG|Tracks executed migrations|
|DATABASECHANGELOGLOCK|Prevents concurrent migration|
|Context|Environment-specific changes|
|Label|Feature-based grouping|
|Rollback|Undo database change|
|generateChangeLog|Generate migrations from existing DB|
|update|Apply migrations|
|changelogSync|Mark migrations as already executed|

---

💡 **One important concept to remember:**

Liquibase treats **database schema changes like Git commits**.

```
ChangeSet ≈ Git Commit
ChangeLog ≈ Git Repository History
DATABASECHANGELOG ≈ Git Log
```

---


