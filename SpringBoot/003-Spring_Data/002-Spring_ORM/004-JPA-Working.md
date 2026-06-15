
---

![[jpa.png]]


---

## 3️⃣ Core components 

We’ll go **top to bottom** exactly like your image.

---

## 4️⃣ Persistence Unit (Configuration part)

📌 **What it is**

- Defined in `persistence.xml`
    
- Contains:
    
    - DB URL
        
    - Username/password
        
    - Dialect
        
    - Entity classes
        

📌 **Important**

- Created **once**
    
- Used to create `EntityManagerFactory`
    

---

## 5️⃣ EntityManagerFactory (Heavy object)

📌 **What it does**

- Created **when application starts**
    
- Uses **Persistence Unit**
    
- Creates `EntityManager`

📌 **Key point**

- **One per application**
    
- Thread-safe
    

---

## 6️⃣ EntityManager (Most important part ⭐)

📌 **What it does**

- Manages entities (save, update, delete, find)
    
- Talks to database via Hibernate
    

📌 **Key points**

- Created **per request / per operation**
    
- **NOT thread-safe**
    
- Short-lived
    

---

## 7️⃣ Entity (Your Java class)

📌 **What it is**

- Normal Java class annotated with `@Entity`
    
- Represents **one table**
    

```java
@Entity
class Book {
    @Id
    private Long id;
    private String name;
}
```

---

## 8️⃣ EntityTransaction (Unit of work)

📌 **What it does**

- Ensures **ACID**
    
- Controls commit & rollback
    

📌 **Important**

- Lives for **very short time**
    
- Ends with:
    
    - `commit()` ✅
        
    - `rollback()` ❌
        

---

## 9️⃣ Query (Fetching data)

📌 **What it does**

- Reads data from DB
    
- Uses:
    
    - **JPQL** (object-based)
        
    - **SQL** (native)
        

```java
Query q = em.createQuery("select b from Book b");
```


---

## 🔟 Complete working flow (STEP BY STEP)

Let’s say you want to **save a Book**.

---

### ✅ Step 1: App starts

- Persistence Unit loads
    
- `EntityManagerFactory` is created
    

---

### ✅ Step 2: Request comes

- `EntityManager` is created
    

---

### ✅ Step 3: Transaction starts

```java
EntityTransaction tx = em.getTransaction();
tx.begin();
```

---

### ✅ Step 4: Entity operation

```java
em.persist(book);
```

---

### ✅ Step 5: Commit

```java
tx.commit();
```

- Data saved in DB
    

---

### ✅ Step 6: Cleanup

```java
em.close();
```

---

## 🔁 Short lifecycle summary (VERY IMPORTANT)

| Component            | Lifetime           |
| -------------------- | ------------------ |
| Persistence Unit     | App lifetime       |
| EntityManagerFactory | App lifetime       |
| EntityManager        | Per request        |
| EntityTransaction    | Per DB operation   |
| Entity               | As long as managed |

---

## 🧠 One-line mental model 

> **JPA flow = Config → Factory → Manager → Transaction → Entity → DB**

---
