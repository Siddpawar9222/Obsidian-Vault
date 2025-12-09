
---

## 1. Introduction: What is "Non-Relational"?

It is a broad generalization for databases that are **not** relational (i.e., not MySQL, PostgreSQL, Oracle).

- **Crucial Concept:** Just because two databases are "NoSQL" doesn't mean they are similar. A Graph DB is completely different from a Key-Value store.
    
- **The Superpower:** The main reason these are interesting is **Horizontal Scalability**.
    
    - <font color="#ffc000">Most NoSQL databases support Sharding out-of-the-box.</font>
        
    -  *Sharding* means splitting data across multiple servers (scaling out) rather than just buying a bigger server (scaling up).
        

---

## 2. The Three Major Types of NoSQL

### A. Document Databases

**Examples:** MongoDB, Elasticsearch

These are the closest to traditional relational databases in terms of mental models, but with more flexibility.

- **Structure:** Data is stored mostly in **JSON** (or BSON) format.
    
- **Querying:** Supports complex queries, almost like SQL (filtering, finding nested data).
    
- **Key Feature - Partial Updates:** You can update specific fields without rewriting the whole document.
    
    - _Example:_ If you want to increment a post count:
        
        JSON
        
        ```
        {
          "user_id": "12345",
          "total_posts": 270
        }
        ```
        
    - You can run `total_posts += 1` efficiently. You do **not** need to read the whole JSON, modify it, and save the whole thing back.
        
- **Use Cases:**
    
    - Catalog Services (Product info with varying attributes).
        
    - In-app notification services.
        
    - Content Management Systems.
        

### B. Key-Value Stores

**Examples:** Redis, DynamoDB, Aerospike

These are the simplest and fastest databases. Think of them like a giant Hash Map or Dictionary in code.

- **Functionality:** extremely simple and limited.
    
    - `GET(Key)`
        
    - `PUT(Key, Value)`
        
    - `DEL(Key)`
        
- **Access Pattern:** Meant strictly for **key-based access**.
    
- **Limitations:**
    
    - Does **not** support complex queries (like joins or complicated aggregations) for most use cases.
        
- **Scalability:** Can be heavily sharded and partitioned because keys are easy to distribute across machines.
    
- **Use Cases:**
    
    - Caching (Session storage).
        
    - Profile data / Auth tokens.
        
    - Shopping cart data.
        
    - Messages.
        
- **Note:** You _can_ technically use Relational or Document DBs as Key-Value stores, but specialized KV stores (like Redis) are optimized for speed.
    

### C. Graph Databases

**Examples:** Neo4j, Neptune, DGraph

These are designed for data that is heavily interconnected.

- **The Concept:** "What if our graph data structure (from computer science) had a persistent database?"
    
- **Structure:** Stores data as:
    
    - **Nodes** (The entities, e.g., "Arpit", "iPad")
        
    - **Edges** (The relationships, e.g., "Bought", "Follows")
        
    - **Properties** (Details about the node or edge).
        
- **Example:**
    
    Plaintext
    
    ```
    (Arpit) ----[BOUGHT]----> (iPad)
    (User A) ---[FOLLOWS]---> (User B)
    ```
    
- **Strengths:**
    
    - Great for running complex graph algorithms (shortest path, clustering).
        
    - Much faster than SQL `JOINS` for deep relationship queries.
        
- **Use Cases:**
    
    - Social Networks (Friends of friends).
        
    - Recommendation Engines.
        
    - Fraud Detection (Finding rings of suspicious accounts).
        

---

## 3. Quick Comparison Summary

|**Database Type**|**Data Model**|**Best For**|**Examples**|
|---|---|---|---|
|**Document**|JSON-like docs|Flexible schema, General purpose apps|MongoDB|
|**Key-Value**|Key-Value pairs|High speed, Caching, Simple lookups|Redis, DynamoDB|
|**Graph**|Nodes & Edges|Complex relationships, Social networks|Neo4j|

---

## 4. Practical Exercise (Action Item)

To solidify this knowledge, the notes suggest the following practice:

> **Task:** On your local machine, spin up **MongoDB**, **Redis**, and **Neo4j** (using Docker is usually easiest) and play around with their basic commands.

---
