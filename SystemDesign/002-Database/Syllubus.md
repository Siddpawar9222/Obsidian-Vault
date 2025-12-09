

---


### 1. **Core SQL Knowledge**

- Write queries with **JOINs, GROUP BY, HAVING, subqueries**.
    
- Understand **indexes (B-Tree, composite indexes)** → when they help, when they slow inserts.
    
- **Transactions & ACID properties** (atomicity, consistency, isolation, durability).
    
- **Isolation levels** and common issues (dirty read, phantom read).
    

👉 Example: Be able to explain how a bank transfer transaction is handled in DB.

---

### 2. **Schema Design**

- **Normalization** (1NF, 2NF, 3NF) → avoid redundant data.
    
- **Denormalization** for performance when needed.
    
- Understand **primary key, foreign key, unique constraint**.
    
- Be able to design small real-world schemas (LMS, e-commerce, social media).
    

👉 Example: Design tables for **students, courses, and enrollments**.

---

### 3. **Basic Performance Tuning**

- Use **EXPLAIN** to analyze queries.
    
- Add proper **indexes** (on `WHERE`, `JOIN`, `ORDER BY` columns).
    
- Understand difference between **OLTP (transactions)** and **OLAP (analytics)** queries.
    

---

### 4. **Scaling Basics**

- **Replication** (master → replica, read/write split).
    
- **Sharding (horizontal partitioning)** conceptually.
    
- **Partitioning** (range, list, hash).
    

👉 Example: Why Flipkart uses multiple DBs for orders, products, and payments.

---

### 5. **Caching (must know!)**

- Why caching reduces DB load.
    
- Redis/Memcached basics.
    
- **Cache invalidation** strategies (write-through, write-around, write-back).
    

👉 Example: Twitter timeline is cached in Redis to avoid hitting DB every time.

---

### 6. **Consistency & CAP Theorem**

- Be able to explain **Consistency vs Availability** tradeoff.
    
- Strong vs eventual consistency.
    
- Where each is acceptable (Banking = Strong, Instagram feed = Eventual).
    

---

### 7. **NoSQL Awareness**

- When to use SQL vs NoSQL.
    
- Types of NoSQL:
    
    - Key-Value (Redis, DynamoDB)
        
    - Document (MongoDB)
        
    - Column (Cassandra)
        
    - Graph (Neo4j)
        
- Not deep mastery, but enough to explain **when you would choose them**.
    

---

### 8. **Practical Knowledge**

- **Backup & restore** strategies.
    
- **Migrations** (adding/removing columns safely).
    
- Understand what happens when DB goes down (failover).
    

---
