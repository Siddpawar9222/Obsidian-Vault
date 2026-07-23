

## When PostgreSQL automatically creates an index

PostgreSQL automatically creates an index in these cases:

| Constraint      | Automatic Index? | Index Type                            |
| --------------- | ---------------- | ------------------------------------- |
| **PRIMARY KEY** | ✅ Yes            | B-tree                                |
| **UNIQUE**      | ✅ Yes            | B-tree                                |
| **EXCLUSION**   | ✅ Yes            | GiST (or the access method specified) |

That's it.

---

## Primary Key

```sql
CREATE TABLE employee (
    id BIGSERIAL PRIMARY KEY
);
```

PostgreSQL automatically creates:

```text
employee_pkey
```

Internally it's similar to:

```sql
CREATE UNIQUE INDEX employee_pkey
ON employee(id);
```

You never need to create another index on the primary key.

---

## Unique Constraint

```sql
CREATE TABLE employee (
    email VARCHAR(255) UNIQUE
);
```

PostgreSQL automatically creates:

```text
employee_email_key
```

Internally it's similar to:

```sql
CREATE UNIQUE INDEX employee_email_key
ON employee(email);
```

Again, no need to create another index.

---

## Exclusion Constraint (Advanced)

This is less common, but PostgreSQL also creates an index for exclusion constraints.

Example:

```sql
EXCLUDE USING gist (room_id WITH =, booking_period WITH &&)
```

This is often used in booking systems to prevent overlapping reservations.

Unlike primary keys and unique constraints, it typically uses a **GiST** index rather than a B-tree.

---

# When PostgreSQL does NOT create an index

These are important because many developers assume PostgreSQL creates indexes for them—it doesn't.

## Foreign Key

```sql
CREATE TABLE orders (
    customer_id INT REFERENCES customer(id)
);
```

❌ No index is created on `customer_id`.

If your application often runs:

```sql
SELECT *
FROM orders
WHERE customer_id = 100;
```

you should create:

```sql
CREATE INDEX idx_orders_customer
ON orders(customer_id);
```

---

## Normal Column

```sql
first_name VARCHAR(100)
```

No index.

---

## NOT NULL

```sql
email VARCHAR(255) NOT NULL
```

No index.

---

## CHECK Constraint

```sql
salary NUMERIC CHECK (salary > 0)
```

No index.

---

## DEFAULT

```sql
created_at TIMESTAMP DEFAULT now()
```

No index.

---

## Industrial Example

Imagine an ERP `employee` table:

```text
employee
---------
id
email
employee_code
department_id
manager_id
status
city
created_at
```

Typical indexing strategy:

| Column        | Reason              | Auto Index? | Manual?   |
| ------------- | ------------------- | ----------- | --------- |
| id            | Primary Key         | ✅           | No        |
| email         | Unique              | ✅           | No        |
| employee_code | Unique              | ✅           | No        |
| department_id | Foreign Key         | ❌           | ✅ Usually |
| manager_id    | Foreign Key         | ❌           | ✅ Usually |
| status        | Frequently filtered | ❌           | Depends   |
| city          | Sometimes searched  | ❌           | Depends   |
| created_at    | Sorting/Reports     | ❌           | Depends   |

---

# How PostgreSQL uses an index

Suppose your table has 1 crore (10 million) rows.

Without an index:

```sql
SELECT *
FROM employee
WHERE email = 'abc@gmail.com';
```

PostgreSQL has to scan rows until it finds the match.

With a unique index:

```text
B-tree

          M
       /      \
     G          T
   /  \       /   \
 A...F H...L N...S U...Z
```

PostgreSQL navigates the tree directly to the matching value, avoiding a full table scan.

---

## One more thing worth knowing

Even if an index exists, PostgreSQL **doesn't always use it**.

For example:

```sql
SELECT *
FROM employee
WHERE status = 'ACTIVE';
```

If **95% of employees are ACTIVE**, PostgreSQL may choose a **sequential scan** because reading almost the whole table can be faster than repeatedly jumping through an index.

The PostgreSQL query planner estimates the cost of different execution plans and picks the cheapest one.

This is why in production we don't just create indexes—we also inspect execution plans using:

```sql
EXPLAIN ANALYZE
SELECT *
FROM employee
WHERE email = 'abc@gmail.com';
```


---




This is one of the most interesting optimizations PostgreSQL does. It may seem counterintuitive at first, so let's understand it from scratch.

---

# Imagine this table

```text
employee

id     status
------------------
1      ACTIVE
2      ACTIVE
3      ACTIVE
4      ACTIVE
5      INACTIVE
...
```

Suppose there are **10,000,000 (1 crore)** employees.

And:

* 9,500,000 are `ACTIVE`
* 500,000 are `INACTIVE`

Now suppose you created an index on `status`.

```
CREATE INDEX idx_status ON employee(status);
```

---

# Query 1

```sql
SELECT *
FROM employee
WHERE status = 'ACTIVE';
```

This query returns

```
9,500,000 rows
```

Now let's see two possible ways PostgreSQL can execute it.

---

# Option 1 — Use the index

PostgreSQL first searches the B-tree.

```
B-tree

        ACTIVE
       /
INACTIVE
```

It quickly finds all pointers to rows where

```
status = ACTIVE
```

But here's the catch.

The index **does not store the entire row** (unless you're using advanced index types or covering indexes).

It only stores something like:

```text
ACTIVE
---------
Row 10
Row 18
Row 27
Row 40
...
Row 9,500,000
```

Now PostgreSQL must fetch each of those rows from the table.

Imagine doing this

```
Index
 ↓
Table row 10

Index
 ↓
Table row 18

Index
 ↓
Table row 27

Index
 ↓
Table row 40

...
```

It has to jump between the index and the table millions of times.

That is expensive.

---

# Option 2 — Ignore the index

Instead PostgreSQL says:

> "Almost every row is ACTIVE anyway."

So it simply reads the table from top to bottom.

```
Row 1
Row 2
Row 3
Row 4
Row 5
...
Row 10,000,000
```

This is called a **Sequential Scan**.

Reading data sequentially is extremely fast because disks and SSDs are optimized for continuous reads.

There is no jumping around.

---

# Which is faster?

Let's imagine some numbers.

Using the index

```
Search index
+
9,500,000 table lookups

Time = 12 seconds
```

Sequential scan

```
Read table once

Time = 5 seconds
```

Even though an index exists,

**the sequential scan is faster.**

So PostgreSQL ignores the index.

---

# Now consider another query

```sql
SELECT *
FROM employee
WHERE status = 'INACTIVE';
```

Only

```
500,000 rows
```

match.

Now PostgreSQL thinks

> "Only 5% of the table matches."

Using the index means it only needs to fetch a relatively small part of the table.

So it will usually use

```
Index Scan
```

instead of

```
Sequential Scan
```

---

# Another example: Email

Suppose every employee has a different email.

```text
abc@gmail.com
xyz@gmail.com
...
```

Now you run

```sql
SELECT *
FROM employee
WHERE email = 'abc@gmail.com';
```

Only **one row** matches.

The planner immediately uses the index because:

```
Index Search

↓

One row

↓

Done
```

Scanning all 1 crore rows would be much slower.

---

# Real-life analogy

Imagine a library with **1,000 books**.

You want **one specific book**.

You use the catalog (the index).

```
Catalog
↓

Shelf 87

↓

Book found
```

Very fast.

Now imagine your teacher says:

> "Bring me every English book."

Suppose **950 out of 1000 books are English**.

Would you:

* Check the catalog 950 times?

or

* Walk through every shelf once?

Walking through every shelf once is much faster.

That's exactly what PostgreSQL does.

---

# How does PostgreSQL know?

It keeps statistics about your tables using the `ANALYZE` command (run automatically by autovacuum in normal operation).

For example, PostgreSQL might know:

```text
status

ACTIVE     95%
INACTIVE    5%
```

When you execute:

```sql
SELECT *
FROM employee
WHERE status = 'ACTIVE';
```

the **query planner** estimates:

* How many rows will match?
* How much I/O will an index scan require?
* How much I/O will a sequential scan require?

Then it chooses the cheaper execution plan.

---

## The important production lesson

**An index is not a command that forces PostgreSQL to use it.**

An index is simply **an option** available to the PostgreSQL query planner.

The planner evaluates different strategies (such as Sequential Scan, Index Scan, Bitmap Index Scan, etc.) and chooses the one with the lowest estimated cost for that specific query and the current data distribution.

That's why two queries on the same indexed column can use different execution plans depending on how much data they are expected to return.



--- 

Yes, you've understood the core idea, but I'd refine it slightly because the exact factor is **not just the amount of data returned**.

The more accurate rule is:

> **Indexes are most beneficial when the query is selective, meaning it returns only a small fraction of the table.**

Let's look at some examples.

### Example 1: Very selective query ✅ (Index is useful)

Suppose you have **1 crore (10 million)** employees.

```sql
SELECT *
FROM employee
WHERE email = 'john@gmail.com';
```

Only **1 row** matches.

The index quickly finds that one row.

**PostgreSQL uses the index.**

---

### Example 2: Moderately selective query ✅

```sql
SELECT *
FROM employee
WHERE department_id = 10;
```

Suppose department 10 has **500 employees**.

Fetching 500 rows from a table of 1 crore rows is still a tiny fraction.

**The index is usually beneficial.**

---

### Example 3: Low selectivity ❌

```sql
SELECT *
FROM employee
WHERE status = 'ACTIVE';
```

Suppose:

* Total rows = **1,00,00,000**
* ACTIVE = **95,00,000**

Using the index means:

1. Read the index.
2. Jump to the table 95 lakh times.

A sequential scan is often faster.

So PostgreSQL may ignore the index.

---

## Think of it like this

Imagine a phone book.

### Looking for one person

```
Siddhesh Pawar
```

Use the index (alphabetical order).

Very fast.

---

### Looking for everyone whose name starts with "S"

Suppose 40% of the phone book starts with "S".

At some point, it becomes easier to just flip through the whole book rather than repeatedly jumping using the index.

---

## The real production rule

It's not:

> ❌ "Small data = use index, large data = don't use index."

Instead, it's:

> ✅ "Use an index when the query filters down to a relatively small percentage of the table."

---

## Rule of thumb

| Query                                             | Rows Returned | Index Likely Used? |
| ------------------------------------------------- | ------------: | ------------------ |
| Find by Primary Key                               |             1 | ✅ Yes              |
| Find by Unique Email                              |             1 | ✅ Yes              |
| Find by PAN                                       |             1 | ✅ Yes              |
| Find all employees in one department (500 of 10M) |      Very few | ✅ Usually          |
| Find ACTIVE employees (95% of table)              |    Almost all | ❌ Usually not      |
| `SELECT * FROM employee`                          |  Entire table | ❌ Never            |

---

One final note: there isn't a fixed cutoff like "10%" or "20%". PostgreSQL's query planner uses table statistics, row sizes, storage layout, and estimated I/O costs to decide whether an index scan or a sequential scan is cheaper. That's why the same query might use an index today but choose a sequential scan later if the data distribution changes.


---


```
-- command to check indexing 
\d employee
```

