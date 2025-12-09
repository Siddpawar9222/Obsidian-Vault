
---

## 🔹 Why Database Scaling Matters

- Database is the **heart of any application** (banking, e-commerce, streaming).
    
- If DB is slow or down → whole system suffers.
    
- Scaling = making the DB handle **more users, more traffic, more data**.
    

---

## 1. **Vertical Scaling (Scale Up)**

👉 Add more power (CPU, RAM, Disk) to **one machine**.

- ✅ Easy to implement (just upgrade server).
    
- ❌ Needs downtime during reboot.
    
- ❌ Has **hardware limits** → can’t scale forever.
    

📌 **Example (Industry)**

- Small e-commerce startup uses MySQL.  
    Initially, 2-core CPU, 8 GB RAM is enough.  
    As traffic grows (Diwali sale), queries become slow.  
    They upgrade to **16-core CPU, 128 GB RAM** on same server.  
    → Faster performance but still one failure point.
    

---

## 2. **Horizontal Scaling (Scale Out)**

👉 Add **more servers** instead of upgrading one.

Two main approaches: 
    - **Read Replicas**
    - **Sharding (Data Partitioning)**

### (a) **Read Replicas**

- Traffic pattern: **90% reads, 10% writes**.
    
- Master handles **writes**.
    
- Replicas handle **reads**.
    
- Sync/Async replication keeps replicas updated.
    

📌 **Example (Industry)**

- Instagram: When you scroll feed (read-heavy), queries go to **replicas**.
    
- When you upload a photo (write), it goes to **master**.
    
- This makes system handle millions of users.
    

---

## 3. **Replication**

Replication = keeping **multiple copies** of DB (Master + Replicas).

### 🔹 (i) Synchronous Replication

- Master waits until Replica confirms.
    
- ✅ **Strong consistency** (no data mismatch).
    
- ❌ Slower writes.
    

📌 **Example**

- Banking system: When you transfer ₹500, both master & replica confirm before success.
    
- Critical because money can’t “disappear”.
    

### 🔹 (ii) Asynchronous Replication

- Master doesn’t wait for Replica.
    
- ✅ Faster writes.
    
- ❌ Eventual consistency (replica may lag).
    

📌 **Example**

- Social media likes/comments:  
    You like a post → Master saves instantly.  
    Replicas may show it after a few seconds.
    
- Small delay is acceptable here.
    

---

## 📖 Quick Notes (Interview Friendly)

- **Vertical Scaling** = Upgrade server hardware. Easy, but limited.
    
- **Horizontal Scaling** = Add more DB servers. Common in industry.
    
- **Read Replicas** = Reduce read load, keep master free for writes.
    
- **Replication** = Master → Replica copy. Two types:
    
    - Sync: Strong consistency, slow writes.
        
    - Async: Eventual consistency, fast writes.
        

---

