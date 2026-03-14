
---


### 1. What is a **Schema** in a Database?

Think about a **cupboard in your house**.

- Inside the cupboard you keep **different folders**.
    
- Inside each folder you keep **documents**.
    

In a database:

- **Database** → Cupboard
    
- **Schema** → Folder
    
- **Table** → Document inside the folder
    

So,

👉 **Schema is a container that organizes database objects like tables, views, indexes, functions, etc.**

It helps **group related tables together**.

---

### 2. Simple Real-World Example

Imagine a **School Management System database**.

Inside the database we create different schemas.

```
Database: school_db
```

Schemas inside it:

```
student_schema
teacher_schema
finance_schema
```

Inside **student_schema**

```
students
attendance
marks
```

Inside **finance_schema**

```
fees
payments
refunds
```

So the structure looks like:

```
Database
   |
   |--- student_schema
   |        |--- students (table)
   |        |--- attendance (table)
   |        |--- marks (table)
   |
   |--- finance_schema
            |--- fees (table)
            |--- payments (table)
```

---

# Why  Schema :  


# 1️⃣ Module Separation (Very Common in Large Systems)

Large applications have **different modules**.

Example: **Learning Management System (LMS)** (similar to what you worked on).

Instead of keeping all tables in `public`, companies create schemas per module.

```
auth.users
auth.roles

student.students
student.attendance

payment.transactions
payment.invoices

notification.notifications
```

### Structure

```
Database
   |
   |--- auth schema
   |        users
   |        roles
   |
   |--- student schema
   |        students
   |        attendance
   |
   |--- payment schema
            transactions
            invoices
```

### Benefits

- Clean structure
    
- Easier maintenance
    
- No table name conflicts
    
- Teams can work independently
    

---

# 2️⃣ Multi-Tenant Architecture (Very Powerful Use Case)

This is used when **one application serves many customers**.

Example:  
Your SaaS application has **100 schools**.

Instead of separate databases, you can create **one schema per tenant**.

```
school1.students
school1.teachers

school2.students
school2.teachers

school3.students
school3.teachers
```

### Structure

```
Database
   |
   |--- school1 schema
   |        students
   |        teachers
   |
   |--- school2 schema
   |        students
   |        teachers
```

Benefits:

- Data isolation
    
- Easier backup per tenant
    
- Same table structure reused
    

You actually worked with **multi-tenant architecture**, so schema-based tenancy is one common strategy.

---

# 3️⃣ Security & Permissions

Different schemas allow **different access control**.

Example:

```
app_data.users
app_data.orders

analytics.reports
analytics.dashboard_data
```

You can give permission like:

```
Analytics team → only analytics schema
Backend app → only app_data schema
```

So teams cannot accidentally modify other data.

---

# 4️⃣ Avoid Table Name Conflicts

Sometimes two modules need same table name.

Example:

```
auth.users
customer.users
admin.users
```

Without schemas, table names would collide.

---

# 5️⃣ Third-Party Extensions

Some PostgreSQL extensions create their **own schema**.

Example:

```
postgis
timescaledb
pg_catalog
```

This keeps extension tables separate from your application tables.

---

# Why Most Projects Use Only `public`

Early stage projects or small systems just do:

```
public.users
public.orders
public.products
public.payments
```

This is fine until the system grows.

---

# Simple Rule Used in Industry

|Project Size|Schema Usage|
|---|---|
|Small project|Only `public`|
|Medium project|Module-based schemas|
|SaaS / Multi-tenant|Schema per tenant|
|Enterprise systems|Many schemas|

---

✅ **Simple understanding**

Schema is like **a folder for tables**.

Small project:

```
public → all tables
```

Large system:

```
auth → auth tables
payment → payment tables
student → student tables
```

---


## Predefined (System Database) Schema  ;

```sql
\c database_name ;  -- choose data
SELECT schema_name FROM information_schema.schemata;
```

Let’s understand the **important ones**.

---

# 1️⃣ `public` (Most Common)

**Purpose:** Default schema where tables are created if you don’t specify any schema.

Example:

```sql
CREATE TABLE users (
   id INT,
   name VARCHAR(100)
);
```

PostgreSQL actually creates:

```
public.users
```

Most application tables live here.

---

# 2️⃣ `pg_catalog`

**Purpose:** Stores PostgreSQL **internal system tables and functions**.

It contains information like:

- tables
    
- indexes
    
- users
    
- permissions
    
- database metadata
    

Example query:

```sql
SELECT * FROM pg_catalog.pg_tables;
```

Example table inside it:

```
pg_catalog.pg_tables
pg_catalog.pg_class
pg_catalog.pg_database
```

These are used by PostgreSQL internally.

---

# 3️⃣ `information_schema`

**Purpose:** Standard SQL schema used to **inspect database metadata**.

Example:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema='public';
```

Developers use it to get:

- tables
    
- columns
    
- constraints
    
- schemas
    

It is **portable across databases** (MySQL, PostgreSQL, Oracle etc.).

---

# 4️⃣ `pg_toast`

**Purpose:** Stores **large data automatically**.

If a row has a very large column like:

- big JSON
    
- long TEXT
    
- binary data
    

PostgreSQL stores it in **TOAST tables** internally.

Example:

```
pg_toast.pg_toast_2619
```

Developers normally **never interact with this schema**.

---

# 5️⃣ `pg_temp_xxx`

**Purpose:** Stores **temporary tables**.

Example:

```sql
CREATE TEMP TABLE test_temp (
   id INT
);
```

PostgreSQL creates it in something like:

```
pg_temp_3.test_temp
```

Each session can have its own temporary schema.

---

# 🧠 Simple Summary

|Schema|Purpose|
|---|---|
|`public`|Default schema for user tables|
|`pg_catalog`|PostgreSQL system metadata|
|`information_schema`|Standard SQL metadata views|
|`pg_toast`|Storage for large column data|
|`pg_temp_xxx`|Temporary tables|

---

✅ **Important thing many developers don't know**

When PostgreSQL searches for tables, it automatically checks:

```
pg_catalog → user schemas → public
```

That is why system functions work even if you don't specify schema.

---
