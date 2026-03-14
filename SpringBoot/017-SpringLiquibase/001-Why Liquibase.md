
--- 

## What is liquibase 

> Liquibase is to your **database** what **Git is to your code** — it versions, tracks, and automates every schema change so your DB stays in sync across every environment, every time.

---

## The Problem Before Liquibase

Imagine you're working on a team of 5 developers. You have a Spring Boot app connected to PostgreSQL. Here's what used to go wrong:

### 🔴 The Old World (Manual SQL Scripts)

**Scenario:** You add a new column `email` to the `users` table in your local DB. You tell your teammate on Slack: _"Hey, run this SQL on your DB"_

```sql
ALTER TABLE users ADD COLUMN email VARCHAR(255);
```

Now multiply this chaos across:

- 5 developers with their own local DBs
- A QA environment
- A Staging environment
- A Production environment

**Problems that explode:**

1. **"Works on my machine"** — Dev A ran the script, Dev B forgot. App crashes for Dev B with `column "email" does not exist`.
    
2. **No history / audit trail** — Who added that column? When? Why? Nobody knows.
    
3. **No ordering guarantee** — Script B depends on Script A. Someone runs B first. Boom.
    
4. **Manual deployment risk** — On release day, a human runs SQL scripts on prod manually. They forget one. Or run it twice. Or run the wrong version.
    
5. **Rollback nightmare** — Something went wrong in prod. How do you undo? There's no `undo` script. You write one from memory at 2 AM.
    
6. **Team onboarding hell** — New dev joins. They need to run 47 SQL files in the right order to set up their local DB. Good luck.
    

---

## ✅ What Liquibase Solves

Liquibase treats your **database schema like source code** — versioned, ordered, and automated.

### Core Concept: The Changelog

You write **changesets** (in XML, YAML, JSON, or SQL):

```xml
<changeSet id="1" author="rahul">
    <addColumn tableName="users">
        <column name="email" type="VARCHAR(255)"/>
    </addColumn>
</changeSet>
```

Liquibase tracks what's been run in a special table it creates: **`DATABASECHANGELOG`**.

|Problem Before|How Liquibase Fixes It|
|---|---|
|"Did Dev B run that script?"|Liquibase auto-runs only **unexecuted** changesets|
|No order guarantee|Changesets run in **defined order**, always|
|Manual prod deployments|Runs automatically **on app startup** via Spring Boot|
|No rollback|You define `<rollback>` blocks per changeset|
|New dev setup pain|Just start the app — DB builds itself|
|No audit trail|`DATABASECHANGELOG` records every change with author + timestamp|

---

## How It Fits in Your Spring Boot + PSQL Stack

```
Spring Boot starts
       ↓
Liquibase runs before app is ready
       ↓
Checks DATABASECHANGELOG table in PostgreSQL
       ↓
Runs only NEW changesets (not already applied)
       ↓
App starts with DB in correct state ✅
```

**In `application.properties`:**

```properties
spring.liquibase.change-log=classpath:db/changelog/db.changelog-master.xml
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
```

**In `pom.xml`:**

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

That's it — Spring Boot auto-configures the rest.

---

## If we  have JPA  `ddl-auto` / `hibernate.hbm2ddl.auto` why we need Liquibase :  

When you add a field in your Entity, Spring Data JPA uses Hibernate to auto-create/update schema via:

```properties
spring.jpa.hibernate.ddl-auto=update   # or create, create-drop
```

---

## 🔴 The Problem with Hibernate DDL Auto

### 1. **`update` mode is dangerously dumb**

Hibernate `update` can:

- ✅ ADD new columns
- ✅ ADD new tables
- ❌ **NEVER drops columns** even if you delete from Entity
- ❌ **NEVER renames columns** — it just adds a new one, old one stays
- ❌ **Cannot change column type** safely (e.g. `VARCHAR(50)` → `VARCHAR(255)`)
- ❌ **Cannot add complex constraints**, indexes, or default values properly

So your DB slowly becomes a **graveyard of ghost columns** nobody knows about.

---

### 2. **It's not repeatable or predictable**

Hibernate guesses what to do by **diffing your Entity vs live DB**. That diff logic is not reliable across:

- Different Hibernate versions
- Different DB engines
- Complex schema situations

---

### 3. **Zero control over migration**

What if you need to:

- Migrate existing data while changing a column?
- Split one column into two?
- Add a column with a default value for existing rows?

```sql
-- Example: You renamed 'phone' to 'mobile_number' and need to copy data
UPDATE users SET mobile_number = phone;
```

Hibernate has **no idea** how to do this. It will just add `mobile_number` and leave `phone` untouched with all your data still in it.

---

### 4. **`update` in Production is a ticking time bomb**

```properties
# This in prod is career-ending territory 💀
spring.jpa.hibernate.ddl-auto=update
```

Every senior dev / DBA will tell you — **never use `update` or `create` in production**. You have zero visibility into what SQL Hibernate is executing on your live database.

---

### 5. **No Rollback**

If a bad migration runs, Hibernate gives you no rollback mechanism. With Liquibase, you define rollback explicitly:

```xml
<changeSet id="2" author="rahul">
    <addColumn tableName="users">
        <column name="mobile_number" type="VARCHAR(20)"/>
    </addColumn>
    <rollback>
        <dropColumn tableName="users" columnName="mobile_number"/>
    </rollback>
</changeSet>
```

---

## The Right Way in Production

|Environment|`ddl-auto`|Liquibase|
|---|---|---|
|Local Dev|`validate` or `none`|✅ Liquibase manages schema|
|QA / Staging|`validate`|✅ Liquibase manages schema|
|**Production**|**`validate`**|✅ **Liquibase manages schema**|

`validate` means — _"Hibernate, just check that the DB matches my Entities. Don't touch anything."_ If there's a mismatch, it throws an error before the app starts. **Safe.**

## Summary

> Hibernate `ddl-auto=update` is a **toy for quick local prototyping**. Liquibase is a **production-grade tool** for real teams shipping real software.

They are **not competitors** — use **both together**:

- Liquibase → manages schema changes
- Hibernate → set to `validate` → confirms entities match the schema

---
