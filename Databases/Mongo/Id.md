

---

# How MongoDB handles ID

In MongoDB:

```java
@Id
private String id;
```

That’s it.

MongoDB automatically creates:

```
ObjectId("65f8a9c2e12a4f3b9c...")
```

No extra annotation needed.

---

# What actually happens internally

When you save:

```java
repo.save(product);
```

If `id` is null:

- MongoDB creates `_id`
    
- Spring maps it back to `id`
    

---

# Example Mongo Document

```json
{
  "_id": ObjectId("65f8a9c2e12a4f3b9c"),
  "name": "iPhone 15",
  "price": 80000
}
```

This `_id` is:

- Globally unique
    
- Time-based
    
- Distributed safe
    

Perfect for microservices.

---

# If you want your OWN ID (like UUID)

You can also do:

```java
@Id
private String id = UUID.randomUUID().toString();
```

Then Mongo will store:

```
"id": "a3f1b2c4-9d..."
```

This is common when:

- You want readable IDs
    
- Or integrate with other services
    

---
## Long as Id

---

## 1. Is it technically possible?

Yes 👍

```java
@Document(collection = "products")
public class Product {

    @Id
    private Long id;   // This works

    private String name;
}
```

MongoDB will store:

```json
{
  "_id": 1,
  "name": "iPhone"
}
```

So yes, MongoDB supports `Long`, `String`, `UUID`, anything.

---

## 2. Then why people avoid Long?

Because **MongoDB does NOT auto-increment** like SQL.

So you must:

- Generate `Long` yourself
    
- Handle concurrency
    
- Handle duplicates
    
- Handle distributed systems
    

Which is dangerous.

---

## 3. The Big Problem: Auto Increment in Microservices

In SQL:

```
id = 1,2,3,4 (handled by DB)
```

In Mongo:  
You must write logic like:

```java
getMaxIdFromDB() + 1
```

Now imagine:

- 10 requests come at same time
    
- All read max id = 100
    
- All try to save id = 101 ❌
    

Boom → duplicate key error.

This is called **race condition**.

---

## 4. Why ObjectId / UUID is best

Mongo’s default:

```json
ObjectId("65f8a9c2e12a4f3b9c")
```

This is:

- Globally unique
    
- Time based
    
- Distributed safe
    
- No coordination needed
    

Perfect for microservices.

---

## 5. When Long is acceptable

You can use `Long` only if:

|Case|Safe?|
|---|---|
|Single node app|maybe|
|Learning project|ok|
|Distributed system|❌|
|Microservices|❌|
|High traffic|❌|

---

## 6. Industry Best Practices

|ID Type|Used in real world|
|---|---|
|ObjectId|⭐⭐⭐⭐⭐|
|UUID|⭐⭐⭐⭐|
|String|⭐⭐⭐|
|Long|⭐|

---

## 7. If you REALLY want Long (safe way)

You need a **counter collection**:

```json
{
  "_id": "product_sequence",
  "seq": 1000
}
```

And atomic update using `findAndModify`.

This is:

- Extra complexity
    
- Slower
    
- Against NoSQL philosophy
    

---

## Final Mental Model (Remember this)

> SQL → numeric IDs (Long)  
> Mongo → distributed IDs (ObjectId / UUID)

If you use Long in Mongo,  
you are **forcing SQL mindset into NoSQL world**.

And that’s exactly what we should avoid in system design 🚀