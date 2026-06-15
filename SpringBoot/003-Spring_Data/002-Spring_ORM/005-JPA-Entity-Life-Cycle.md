
---

# Entity Life Cycle in JPA

An entity in JPA can exist in **4 different states**.

Think about a **Book in a Library** 📚.

A book can be newly created, registered in the library, removed from tracking, or deleted completely.

---

## 🔹 NEW State (Transient)

### 📌 Meaning

* Java object is created
* Not stored in database
* JPA does not track it

```java
Book book = new Book();
book.setName("Java");
```

---

### 📌 Real-World Example

> A book is written, but not yet added to the library.

---

### 📌 Important Points

* No database record exists
* No primary key exists in DB
* JPA ignores this object

---

## 🔹 MANAGED State (Persistent)

### 📌 Meaning

* Entity is connected to database
* JPA tracks all changes automatically

```java
em.persist(book);
```

---

### 📌 Real-World Example

> Book is registered in the library system.

---

### 📌 Important Feature — Dirty Checking

```java
book.setName("Advanced Java");
```

No explicit `save()` or `update()` call is required.

At transaction commit time, JPA automatically updates the database.

✅ This is called **Dirty Checking**.

---

## 🔹 DETACHED State

### 📌 Meaning

* Entity was managed earlier
* EntityManager is now closed
* JPA no longer tracks changes

```java
em.close();
```

---

### 📌 Real-World Example

> Library system is turned OFF, but you still have a printed copy of the book details.

---

### 📌 Important Points

Changes are NOT automatically saved.

```java
book.setName("Spring Boot");
```

❌ Database will not update.

---

## 🔹 REMOVED State

### 📌 Meaning

Entity is marked for deletion.

```java
em.remove(book);
```

---

### 📌 Real-World Example

> Book is removed from the library.

---

### 📌 Actual Delete Happens At

```java
tx.commit();
```

---

## 🔁 Entity Life Cycle Flow

```text
NEW → MANAGED → DETACHED
        ↓
     REMOVED
```

---

# Dirty Checking in JPA

## 📌 Definition

> Dirty checking means JPA automatically detects changes in a managed entity and updates the database during transaction commit.

---

# How Dirty Checking Works

## Entity Becomes Managed

```java
Student s = em.find(Student.class, 1L);
```

Now:

* Entity becomes managed
* JPA stores original values internally

Example snapshot:

```text
name = "Amit"
```

---

## Modify Object

```java
s.setName("Rahul");
```

At this moment:

* Only Java object changes
* No SQL query executes yet

Entity becomes **dirty**.

---

## Transaction Commit

```java
tx.commit();
```

JPA now:

* Compares old value vs new value
* Detects modification
* Executes SQL automatically

```sql
UPDATE student
SET name='Rahul'
WHERE id=1;
```

✅ This automatic update process is called **Dirty Checking**.

---

# Why the Name “Dirty”?

Because:

* Original entity = clean
* Modified entity = dirty

---

# Conditions Required for Dirty Checking

Dirty checking works only if:

| Condition                  | Required |
| -------------------------- | -------- |
| Entity is managed          | ✅        |
| Transaction exists         | ✅        |
| Persistence context active | ✅        |

---

# Cases Where Dirty Checking Does NOT Work

## ❌ Detached Entity

```java
Student s = em.find(Student.class, 1L);

em.close();

s.setName("Rahul");
```

No update happens because JPA is no longer tracking the entity.

---

## ❌ No Transaction

```java
Student s = em.find(Student.class, 1L);

s.setName("Rahul");
```

Without transaction commit, no update occurs.

---

# Why Dirty Checking is Powerful

Without dirty checking:

```java
updateStudentName(id, "Rahul");
```

With dirty checking:

```java
student.setName("Rahul");
```

### Benefits

* Less code
* Cleaner business logic
* Less manual SQL

---

# 🧠 One-Line Memory Trick

> Change object → Commit transaction → Database updates automatically.

---

# Why Developers Think `save()` is Required

Because `save()` sounds like update logic.

But actually:

`save()` is mainly required for:

* NEW entities
* DETACHED entities

For MANAGED entities:

✅ `save()` is usually unnecessary.

---

# Primary Key Change Problem in JPA

---

## Fetch Entity

```java
Student s = em.find(Student.class, 1L);
```

Now entity becomes managed.

Persistence Context internally stores:

```text
(Student.class, id=1) → s
```

---

## Change ID

```java
s.setId(null);
```

This creates a major problem.

---

# Why Changing Primary Key is NOT Allowed

## Important Rule

> Primary key of a managed entity must never change.

### Reason

JPA uses ID to track entity identity.

---

# Internal Confusion in JPA

Before:

```text
(Student, 1) → Student{id=1}
```

After:

```text
(Student, 1) → Student{id=null}
```

Now:

* Internal map says ID = 1
* Object says ID = null

JPA becomes inconsistent.

---

# Common Errors

You may see errors like:

* `identifier of an instance was altered`
* `null id in entity entry`
* `detached entity passed to persist`

All indicate the same root problem.

---

# Design Reason

Primary key represents database row identity.

Changing ID means changing identity itself.

JPA strictly prevents this.

---

# ❌ Wrong Approach

```java
Student s = em.find(Student.class, 1L);

s.setId(null);
```

---

# ✅ Correct Way to Create New Record

## Create New Object

```java
Student newStudent = new Student();

newStudent.setName(s.getName());

em.persist(newStudent);
```

---

## Detach First (Advanced)

```java
em.detach(s);

s.setId(null);

em.persist(s);
```

Usually not recommended.

---

# 🎯 Interview-Ready Explanation

> JPA does not allow changing the primary key of a managed entity because the persistence context uses the identifier to track entity identity. Changing it breaks internal entity tracking.

---

# 🧠 One-Line Memory Trick

> ID is identity. Identity should never change.

---