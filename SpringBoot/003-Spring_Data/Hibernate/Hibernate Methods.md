
---

Imagine:  
You are managing a **student database** (like your LMS project). Each student has a name and a course. We'll use `Student` class with Hibernate to perform actions like save, fetch, update, delete.

---

## **1. `save(Object entity)` – Save New Record**

### Real-life:

You are **registering a new student** for a course.

```java
Student s = new Student("Rahul", "Java");
session.save(s); // Returns ID of new record
```

- **Explanation**: Saves the student object to the database.
    
- **Returns**: the student ID (e.g., `101`).
    
- **Use when**: You want to save and get the ID.
    

---

## **2. `persist(Object entity)` – Save Without ID**

### Real-life:

You are saving student data, but you don’t need the ID right now.

```java
Student s = new Student("Siddhesh", "Spring");
session.persist(s);
```

- Same as `save()`, but doesn’t return ID.
    
- Follows JPA standard.
    

---

## **3. `get(Class, ID)` – Fetch Student by ID**

### Real-life:

You want to **check student details** using their ID.

```java
Student s = session.get(Student.class, 101);
System.out.println(s.getName());
```

- **Returns real object** or `null` if student not found.
    
- **Safe to use when** you're unsure if data exists.
    

---

## **4. `load(Class, ID)` – Lazy Fetch by ID**

### Real-life:

You need a **reference** to the student but don’t need full data immediately.

```java
Student s = session.load(Student.class, 101); // gives proxy
```

- Loads a **proxy** (temporary object).
    
- Only fetches data when you access fields.
    
- Throws **Exception** if ID not found.
    

---

## **5. `update(Object)` – Update Student**

### Real-life:

Student wants to change their course.

```java
s.setCourse("Java + Spring Boot");
session.update(s);
```

- **Updates the student info** in DB.
    
- Use when object is attached to session.
    

---

## **6. `merge(Object)` – Update Detached Student**

### Real-life:

You fetched student data earlier (from a web form), and now you want to update it.

```java
Student s = new Student();
s.setId(101);
s.setName("Updated Rahul");
session.merge(s);
```

- Useful for **detached objects** (not in session).
    
- **Merges** changes into a managed object.
    

---

## **7. `delete(Object)` – Remove Student**

### Real-life:

Student wants to **cancel registration**.

```java
session.delete(student);
```

- Deletes the student record from DB.
    

---

## **8. `createQuery(String hql)` – Custom Query**

### Real-life:

You want to get **all students enrolled in Java**.

```java
Query q = session.createQuery("from Student where course='Java'");
List<Student> list = q.list();
```

- Runs custom **HQL** (Hibernate Query Language).
    
- Returns list of objects.
    

---

## **9. `beginTransaction()`, `commit()`, `rollback()`**

### Real-life:

Group of actions like saving + updating student must happen **together**.

```java
Transaction tx = session.beginTransaction();
session.save(newStudent);
tx.commit(); // or tx.rollback();
```

- Ensures **data safety**.
    

---

## **10. `flush()` – Force DB Write**

### Real-life:

You want to write all changes **immediately**, not wait for session to end.

```java
session.flush();
```

---

## **11. `clear()` – Detach All Objects**

### Real-life:

Reset session – like clearing all form entries.

```java
session.clear();
```

---

## **12. `close()` – End Session**

### Real-life:

Like logging out after finishing your work.

```java
session.close();
```

---

## **detached object** and **proxy object** 

---

## **1. Detached Object**

### **Simple Definition**:

A **detached object** is an object that was once connected to the Hibernate session (from the database), but **now it is disconnected**.

### **Real-Life Example**:

Imagine you logged in to your school website and viewed your profile (it came from the database). You disconnected from the internet. Now you can still **see your data**, but you **cannot save any changes** to the server unless you reconnect.

### **Hibernate Example**:

```java
Session session = sessionFactory.openSession();
Student student = session.get(Student.class, 1); // attached
session.close(); // session is closed

// Now student is detached
student.setCourse("Spring Boot"); // change in memory

Session session2 = sessionFactory.openSession();
session2.beginTransaction();
session2.update(student); // re-attach to update
session2.getTransaction().commit();
```

### **Key Point**:

- Detached object **still holds data**, but is not tracked by Hibernate.
    
- You must use `update()` or `merge()` to reattach and save changes.
    

---

## **2. Proxy Object**

### **Simple Definition**:

A **proxy object** is a **placeholder object** created by Hibernate when you use `load()` instead of `get()`. It delays the database fetch **until you actually use the data** (lazy loading).

### **Real-Life Example**:

You have a **student ID card**, but you haven’t met the student yet. You only get full info **when you call them or meet them**.

### **Hibernate Example**:

```java
Session session = sessionFactory.openSession();

Student student = session.load(Student.class, 1); // proxy created
System.out.println("Object created...");

System.out.println(student.getName()); // Now real DB call happens
```

### **Key Point**:

- `load()` returns a **proxy**, not real object.
    
- Actual DB query runs **only when you access any property**.
    
- If student doesn’t exist and you access `getName()`, it throws `ObjectNotFoundException`.
    

---

## **Quick Comparison Table**

|Feature|Detached Object|Proxy Object|
|---|---|---|
|Meaning|Was connected, now disconnected|Placeholder until real data needed|
|Created When|Session is closed|`session.load()` is used|
|Data Available?|Yes (in memory)|No (fetches on access)|
|DB Hit|No (until reattached)|Yes (when property accessed)|
|Usage|Reuse old data, re-attach to update|Improve performance with lazy load|

---

### **Your Expectation (which is logical):**

- If I **set the ID to null**, Hibernate should **treat it as a new record**, right?
    

> **So why does Hibernate still throw an error?**

---

### **What’s Really Happening Behind the Scenes?**

When you load an entity from the database:

```java
Subject subject = subjectRepository.findById(1L).get(); // this is a managed entity
```

Then **set the ID to null**:

```java
subject.setId(null);
```

And try to **save** it again:

```java
subjectRepository.save(subject);
```

You think:

> “Hey Hibernate, this is a new entity! Insert it.”

But Hibernate says:

> “No! This object came from the database, so it's **detached**. You can’t just change its ID and try to insert.”

---

### **Why Hibernate Complains**

Hibernate tracks entities using something called the **Entity Identity Map**.

When you **load an entity**, Hibernate marks it with:

- A special **identifier (memory reference)**.
    
- Even if you change the ID to `null`, the **object is still known** by Hibernate as a detached instance of the old entity.
    

So Hibernate internally says:

> "This object used to represent record with ID = 1. Now you're saying its ID is null, but I still remember its original identity. I can't treat it as a new entity."

---

### **Technical Reason:**

When you do:

```java
Subject s = subjectRepository.findById(1L).get();
s.setId(null);
subjectRepository.save(s);
```

- The object `s` **is still a detached entity**.
    
- Even if you set `id = null`, Hibernate keeps its **Java memory reference** (identity).
    
- And Hibernate doesn’t allow **persisting a detached entity as a new object**, **even with null ID**.

---

### ✅ **Correct Way (Clone the object)**

If you want to insert a new row using the data from the old object, create a new object:

```java
Subject oldSubject = subjectRepository.findById(1L).get();

Subject newSubject = new Subject();
newSubject.setName(oldSubject.getName());
newSubject.setDescription(oldSubject.getDescription());
// Do not copy ID
subjectRepository.save(newSubject); // Works fine
```

Now Hibernate sees `newSubject` as a **completely new object** in memory with **no identity history**.

---

### **Analogy:**

Imagine a library assigns you a **unique card number**. If you scratch the number and try to apply for a new card using the same plastic card, they’ll say:

> “No, we know this card — it's not new, even if you erased the number.”

Same with Hibernate.

---

### Summary:

|Action|Hibernate Response|
|---|---|
|Load + modify + save|Update (if in same session)|
|Load + close session + set ID null + save|**Error** (detached with identity mismatch)|
|Create new object + copy values|**Works** (treated as fresh insert)|

---
[Hibernate](https://www.geeksforgeeks.org/hibernate-architecture/)

[JPA](https://medium.com/@pratik.941/important-jpa-interview-questions-a-detailed-guide-5c1405e0927b)

