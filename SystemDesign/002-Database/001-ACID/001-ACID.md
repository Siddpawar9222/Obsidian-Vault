
---

## 💡 What is ACID in Databases?

ACID is a set of **four rules** that make sure **your database transactions are safe, correct, and reliable** — even if the system crashes.

**A** — Atomicity  
**C** — Consistency  
**I** —  Isolation  
**D** — Durability

---

## 🏦 Example Scenario

> You are sending ₹1000 from **Alice’s account** to **Bob’s account**.

Steps:

1. Deduct ₹1000 from **Alice's balance**
    
2. Add ₹1000 to **Bob's balance**
    

---

### 1️⃣ **Atomicity** — _"All or Nothing"_

**Definition:** <font color="#ffc000">Ensures a transaction is fully completed or not done at all.</font>

> 💥 Imagine the app crashes after deducting ₹1000 from Alice, but before adding it to Bob.

Without atomicity:

- Alice loses ₹1000 😓
    
- Bob gets nothing
    
- 💔 Data becomes inconsistent
    

With atomicity:

- Either **both steps complete** ✅
    
- Or **neither happens** ❌
    

📌 Think of it as a **single unit** of work that must fully succeed or fully fail.

**SQL Example:**

```sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE name = 'Alice';
UPDATE accounts SET balance = balance + 1000 WHERE name = 'Bob';

COMMIT; -- ensures both steps succeed together
```

---

### 2️⃣ **Consistency** — _"Data must always follow rules"_

**Definition:** <font color="#ffc000">Maintains the database in a valid state before and after a transaction.</font>

> Total money in the system should remain the same.

If Alice had ₹5000 and Bob had ₹3000:  
Before: ₹5000 + ₹3000 = ₹8000  
After: ₹4000 + ₹4000 = ₹8000 ✅

Consistency ensures:

- <font color="#ffc000">No extra money is created</font>
    
- <font color="#ffc000">No rules (like balance can't go negative) are broken</font>
      
-  <font color="#ffc000">Can be done by constraints, cascades, triggers, foreign key check</font>
    

---

### 3️⃣ **Isolation** — _"Transactions don’t disturb each other"_

**Definition:** <font color="#ffc000">Ensures transactions don't interfere with each other.</font> or 
<font color="#ffc000">Transparency of transactions that are happing at same time.</font>

> Imagine Alice and Bob are transferring money **at the same time**.

Without isolation:

- Two transactions might **interfere** and read **half-updated data**
    
- Alice’s balance might become **wrong due to overlap**
    

With isolation:

- Each transaction runs as if **it is the only one**
    
- Others wait or work on their own data
    

📌 Like locking a bank counter — **one customer at a time**.

**SQL Example (with isolation level):**

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE name = 'Alice';
UPDATE accounts SET balance = balance + 1000 WHERE name = 'Bob';

COMMIT;
```

---

### 4️⃣ **Durability** — _"Once done, it stays done"_

**Definition:** <font color="#ffc000">Guarantees that once a transaction is committed, it cannot be undone, even in case of a system failure.</font>

> After ₹1000 is transferred, the power goes off ⚡ or server crashes 💥

Without durability:

- The transaction might be **lost**
    

With durability:

- The transaction is **permanently saved**
    
- Even after restart, Alice still has ₹4000 and Bob ₹4000
    

📌 Think of it like writing to a **permanent ledger or file**.

---

## ✅ Summary with Example

| ACID Property   | Definition                                 | In Our Example                              |
| --------------- | ------------------------------------------ | ------------------------------------------- |
| **Atomicity**   | Ensures transaction fully completes or not | ₹1000 deducted **and** credited, or nothing |
| **Consistency** | Maintains database validity                | Total money stays the same                  |
| **Isolation**   | Transactions don’t interfere               | Two transfers won’t affect each other       |
| **Durability**  | Changes are permanent                      | After power off, money stays transferred    |

---

# SQL Example : 
---

```sql
-- 1️⃣ Ensure balances are always non-negative (Consistency)
ALTER TABLE accounts
ADD CONSTRAINT chk_balance_nonnegative CHECK (balance >= 0);

-- 2️⃣ Set isolation level (Isolation)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- 3️⃣ Start the transaction (Atomicity + Durability)
BEGIN TRANSACTION;

-- Deduct ₹1000 from Alice
UPDATE accounts 
SET balance = balance - 1000 
WHERE name = 'Alice';

-- Add ₹1000 to Bob
UPDATE accounts 
SET balance = balance + 1000 
WHERE name = 'Bob';

-- 4️⃣ Commit the transaction (Atomicity + Durability)
COMMIT;

-- ✅ After COMMIT:
-- - Either both steps happened or none happened (Atomicity)
-- - Total money remains same and balance rules are enforced (Consistency)
-- - Transactions don’t interfere with others (Isolation)
-- - Changes are permanent even after crash (Durability)
```

---

### 🔹 How this covers ACID:

| ACID Property   | How it’s implemented in SQL                                          |
| --------------- | -------------------------------------------------------------------- |
| **Atomicity**   | `BEGIN TRANSACTION ... COMMIT` ensures all-or-nothing                |
| **Consistency** | `CHECK (balance >= 0)` ensures valid balances                        |
| **Isolation**   | `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE` prevents interference |
| **Durability**  | `COMMIT` ensures changes persist permanently                         |

---
