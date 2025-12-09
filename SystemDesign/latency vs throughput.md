

---

## 1. **Latency**

👉 **Definition:**  
Latency is the **time it takes for one request to travel through the system and get a response**.  
Think of it as **delay per request**.

👉 **Real-world example:**

- Imagine ordering food in a restaurant.
    
- If the waiter takes **10 minutes** to bring your food after you order, that’s the **latency**.
    

👉 **Computer example:**

- If you send a request to a server and it replies in **200 ms**, then the **latency is 200 ms**.
    
- Database query taking **50 ms** = 50 ms latency.
    

---

## 2. **Throughput**

👉 **Definition:**  
Throughput is the **amount of work a system can handle in a given time (requests per second, transactions per minute, etc.)**.  
Think of it as **capacity**.

👉 **Real-world example:**

- In the same restaurant, if the kitchen can prepare **100 meals per hour**, that’s the **throughput**.
    
- Even if each meal takes 10 minutes (latency), the restaurant can still serve many people at once.
    

👉 **Computer example:**

- A server can handle **1000 requests per second**.
    
- A database can process **500 transactions per second**.
    

---

## 3. **Key Difference**

|**Aspect**|**Latency** (Delay)|**Throughput** (Capacity)|
|---|---|---|
|Meaning|Time taken for 1 request|Number of requests handled per second|
|Unit|ms, sec|req/sec, transactions/sec|
|Analogy|How long 1 dish takes|How many dishes per hour|
|Example|Query = 100 ms|DB = 2000 queries/sec|

---

## 4. **Relation between them**

- **Low latency** ≠ **High throughput** (and vice versa).
    
- Example:
    
    - A Ferrari has **low latency** (fast per trip), but it can carry only 2 people → low throughput.
        
    - A bus has **higher latency** (slower trip), but can carry 50 people → high throughput.
        

---

⚡ **Summary in one line:**

- **Latency = how fast one request is answered.**
    
- **Throughput = how many requests can be handled in a time period.**
    

---


