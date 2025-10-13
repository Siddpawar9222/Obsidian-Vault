

---
[MediumBlog](https://medium.com/javarevisited/jacksons-jsonignore-cost-us-80k-in-aws-bills-4a3bec35e067#bypass)
### 1️⃣ Key rule in Hibernate proxies:

- **The first getter you call on a proxy is important.**
    
- Hibernate proxies track whether the object is “fully initialized.”
    
- Depending on the **proxy’s internal state** and **which getter is accessed first**, it may decide to **load all lazy relationships automatically**.
    

---

### 2️⃣ Why random first getter can be dangerous:

- If the proxy thinks:
    
    > “This object is partially loaded and you’re accessing a field I wasn’t expecting first…”
    
- Then it **loads all lazy fields** from the database to ensure the object is complete.
    
- So yes, **calling getters in a “random” order** on a partially loaded proxy can accidentally trigger **a lot of database queries**.
    

---

### 3️⃣ Practical takeaway

- Never rely on **directly returning Hibernate entities in APIs**, because the **getter access order** can cause unexpected lazy loading.
    
- Always use **DTOs** (Data Transfer Objects) or configure Jackson with **Hibernate5Module** to safely ignore lazy fields.
    

---

💡 **Analogy (best one):**

- Hibernate proxy = magical box with locked drawers (lazy fields).
    
- Proxy keeps track of “first drawer touched.”
    
- First drawer you touch determines if **all drawers open automatically** or not.
    
- Skip drawers or touch them in the wrong order → all drawers fling open → database queries explode.
    

---

# Clone Issue

---

### 1️⃣ What you did

```java
List<Chapter> chapterList = dmsChapterService.getChaptersByClassId(existingClassId);

for (Chapter c : chapterList) {
    c.setId(null);          // trying to clone
    dmsChapterService.save(c); // save as new
}
```

- Your goal: copy chapters and save them as new rows.
    
- You set `id = null` to tell JPA: “This is a new entity.”
    

---

### 2️⃣ Why it gives an error

Several things can go wrong here depending on your entity mapping:

#### **A. Hibernate is still tracking the original entity**

- `chapterList` contains **managed entities** from the current persistence context.
    
- Setting `id = null` **does not detach them from the persistence context**.
    
- When you call `save(c)`, Hibernate sees:
    
    - “This is an entity I am already managing, but the ID is null… hmm, something is wrong.”
        
- This can result in errors like:
    
    ```
    org.hibernate.PersistentObjectException: detached entity passed to persist
    ```
    

#### **B. Relationships / foreign keys**

- If `Chapter` has relationships (`@ManyToOne`, `@OneToMany`), simply nulling the ID **doesn’t clone the child objects**.
    
- Hibernate will still try to reference the **same related entities**, which can cause **constraint violations**.
    

#### **C. Collection or caching issues**

- If `Chapter` has `@OneToMany` collections (e.g., `List<Lessons>`), the collection is still attached to the **old entity**.
    
- Saving can fail because Hibernate tries to persist the **same collection objects twice**.
    

---

### 3️⃣ Correct ways to clone an entity

#### **Option 1: Detach + null ID**

```java
for (Chapter c : chapterList) {
    Chapter clone = new Chapter();  // create new object
    clone.setName(c.getName());
    clone.setDescription(c.getDescription());
    // copy other fields manually
    clone.setId(null);              // new entity
    dmsChapterService.save(clone);
}
```

- You create a **new object**, copy fields manually.
    
- Hibernate sees it as a completely new entity → no error.
    

#### **Option 2: Use `entityManager.detach()`**

```java
for (Chapter c : chapterList) {
    entityManager.detach(c);  // detach from persistence context
    c.setId(null);
    dmsChapterService.save(c);
}
```

- Detaches the original entity so Hibernate stops tracking it.
    
- But still risky if there are **lazy relationships** or collections — manual cloning is safer.
    

#### **Option 3: Use a DTO + mapping**

```java
for (Chapter c : chapterList) {
    ChapterDTO dto = mapper.toDTO(c);
    Chapter clone = mapper.fromDTO(dto);
    clone.setId(null);
    dmsChapterService.save(clone);
}
```

- Converts entity to a simple DTO → creates a fresh entity from DTO → safe.
    

---

### ✅ Key takeaway

- **You can’t just set `id = null` on a managed entity** and save it.
    
- Hibernate **remembers the object in the persistence context**, so it gets confused.
    
- The safe way: **create a new object** (manual clone or via DTO) and save that.
    

---

If you want, I can **write a small Java example showing how to clone a list of Chapters safely, including lazy fields**, so you can just copy-paste it.

Do you want me to do that?