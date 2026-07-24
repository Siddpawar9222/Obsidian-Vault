
---

# PostgreSQL Indexing Guide

An index is a database search structure that makes queries faster. Think of a database table as a thick book. Without an index, finding a specific topic requires looking through every single page from beginning to end (**Sequential Scan**). An index at the back of the book allows you to jump directly to the correct page (**Index Scan**).

This guide will take you step-by-step through how PostgreSQL indexes work, when they are created automatically, when you must create them manually, and why the database might ignore them.

---

## Part 1: How to Check Existing Indexes

Before editing or creating indexes, you need to see what already exists on your table.

In the PostgreSQL command-line interface (`psql`), you can view a table's structure and its indexes using:

```sql
\d employee
```

This command will list all columns, data types, constraints, and existing indexes at the bottom of the output.

---

## Part 2: When PostgreSQL Automatically Creates Indexes

You do not need to create indexes for every column. PostgreSQL automatically creates a **B-tree** index (or **GiST** index for exclusion constraints) when you define certain constraints on a table:

| Constraint Type | Automatic Index? | Default Index Type |
| :--- | :---: | :--- |
| **PRIMARY KEY** | ✅ Yes | B-tree |
| **UNIQUE** | ✅ Yes | B-tree |
| **EXCLUSION** | ✅ Yes | GiST (or specified access method) |

### 1. Primary Key Constraint
```sql
CREATE TABLE employee (
    id BIGSERIAL PRIMARY KEY
);
```
PostgreSQL automatically creates a unique index named `employee_pkey`. Behind the scenes, it functions like:
```sql
CREATE UNIQUE INDEX employee_pkey ON employee(id);
```
**Rule**: Never manually create an index on a primary key column.

### 2. Unique Constraint
```sql
CREATE TABLE employee (
    email VARCHAR(255) UNIQUE
);
```
PostgreSQL automatically creates a unique index named `employee_email_key`. Behind the scenes, it functions like:
```sql
CREATE UNIQUE INDEX employee_email_key ON employee(email);
```
**Rule**: Never manually create an index on a unique constraint column.

### 3. Exclusion Constraint (Advanced)
Exclusion constraints ensure that if any two rows are compared on specified columns, at least one comparison returns false. This is commonly used in booking systems to prevent overlapping schedules:
```sql
CREATE TABLE room_booking (
    room_id INT,
    booking_period TSRANGE,
    EXCLUDE USING gist (room_id WITH =, booking_period WITH &&)
);
```
PostgreSQL automatically creates a **GiST** index to enforce this rule and search overlapping ranges quickly.

---

## Part 3: When PostgreSQL does NOT Create Indexes

A very common mistake is assuming that constraints like Foreign Keys or default fields get indexed automatically. They do not. 

You must create indexes manually for the following cases:

* **Foreign Keys**: `customer_id INT REFERENCES customer(id)` (No auto-index!)
* **Normal Columns**: `first_name VARCHAR(100)` (No auto-index!)
* **NOT NULL Columns**: `email VARCHAR(255) NOT NULL` (No auto-index!)
* **CHECK Constraints**: `CHECK (salary > 0)` (No auto-index!)
* **DEFAULT Fields**: `created_at TIMESTAMP DEFAULT now()` (No auto-index!)

### Foreign Key Index Example
Suppose you have an orders table:
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id INT REFERENCES customer(id) -- Foreign Key
);
```
If your application frequently queries orders by customer:
```sql
SELECT * FROM orders WHERE customer_id = 100;
```
You should manually create an index:
```sql
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

### Industrial Example: ERP Employee Table
Here is a typical indexing strategy for an enterprise database table:

| Column | Role / Constraint | Auto Indexed? | Manual Index Recommended? |
| :--- | :--- | :---: | :---: |
| `id` | Primary Key | ✅ Yes | ❌ No |
| `email` | Unique | ✅ Yes | ❌ No |
| `employee_code`| Unique | ✅ Yes | ❌ No |
| `department_id`| Foreign Key | ❌ No | ✅ Yes (Frequently joined/filtered) |
| `manager_id` | Foreign Key | ❌ No | ✅ Yes (Frequently joined/filtered) |
| `status` | Filter Column | ❌ No | ⚠️ Depends (See Selectivity below) |
| `city` | Search Column | ❌ No | ⚠️ Depends (Only if filtered often) |
| `created_at` | Sort Column | ❌ No | ⚠️ Depends (For date range reports) |

---

## Part 4: How PostgreSQL Uses Indexes (And Why It Might Ignore Them)

An index is **not a command** that forces PostgreSQL to search a certain way. It is simply an option. The PostgreSQL **Query Planner** evaluates the cost of different search plans and picks the cheapest one.

PostgreSQL uses index structures like **B-trees** to search efficiently:

```text
                  [ M ] (Root node)
                /       \
            [ G ]       [ T ] (Intermediate nodes)
           /   \        /   \
        [A..F] [H..L] [N..S] [U..Z] (Leaf nodes containing row pointers)
```

### The Concept of Selectivity

The primary rule the Query Planner uses to decide whether to use an index is **selectivity**:
> **Indexes are most beneficial when the query is highly selective—meaning it returns only a small percentage of the total rows in the table.**

### Real-World Example: Active vs. Inactive Employees
Suppose you have an employee table with **10,000,000 (10 million)** rows and an index on `status`:
* **9,500,000 (95%)** are `ACTIVE`
* **500,000 (5%)** are `INACTIVE`

```sql
CREATE INDEX idx_status ON employee(status);
```

#### Query 1: Find Active Employees (Low Selectivity)
```sql
SELECT * FROM employee WHERE status = 'ACTIVE';
```
* **What happens**: The index only stores row pointers. If the planner uses the index, it has to jump back and forth between the index and the main storage table 9.5 million times.
* **Planner Decision**: It ignores the index and performs a **Sequential Scan** (reads the table once from top to bottom), which is much faster.

#### Query 2: Find Inactive Employees (High Selectivity)
```sql
SELECT * FROM employee WHERE status = 'INACTIVE';
```
* **What happens**: The query returns a small fraction (5%) of the table.
* **Planner Decision**: It performs an **Index Scan** because searching the B-tree and fetching 500,000 matching rows is cheaper than scanning all 10 million rows.

### Rule of Thumb for Index Usage

| Query Type | Rows Returned | Index Used? | Rationale |
| :--- | :--- | :---: | :--- |
| Find by Primary Key (`id = 1`) | 1 | ✅ Yes | Extremely selective |
| Find by Unique Value (`email = 'abc@test.com'`) | 1 | ✅ Yes | Extremely selective |
| Find by Foreign Key (`dept_id = 10`) | Very few (e.g. 500) | ✅ Usually | High selectivity |
| Find by Status (`status = 'ACTIVE'`) | Most of table (e.g. 95%) | ❌ No | Low selectivity; Sequential scan is faster |
| Get All Rows (`SELECT * FROM table`) | All (100%) | ❌ No | Must retrieve everything anyway |

---

## Part 5: Inspecting Queries in Production

To verify whether PostgreSQL is using your indexes, use the `EXPLAIN ANALYZE` command:

```sql
EXPLAIN ANALYZE
SELECT * FROM employee WHERE email = 'abc@gmail.com';
```

This output will show you:
1. The exact plan chosen (e.g., `Seq Scan` or `Index Scan using employee_email_key`).
2. The estimated cost vs. the actual execution time.
3. The number of rows processed.



---

