
---

# 🔗 Types of Relationships in JPA 

In JPA, **relationships define how tables are connected using foreign keys**.

---

## 📌 Relationship Types Overview

| Relationship  | Meaning                         | Real-World Example |
| ------------- | ------------------------------- | ------------------ |
| `@OneToOne`   | One entity → exactly one entity | Student ↔ Address  |
| `@OneToMany`  | One entity → many entities      | School → Students  |
| `@ManyToOne`  | Many entities → one entity      | Students → School  |
| `@ManyToMany` | Many entities → many entities   | Students ↔ Courses |

---

### Hibernate Relationship Design :

#### The core question: who should own the relationship?

 when two entities are related, one side needs to be the **owner** of the relationship. <font color="#ffc000">The owner is the side that controls the foreign key in the database.</font>

There are two choices:

- **Parent → Child** (one-to-many from parent side)
- **Child → Parent** (many-to-one from child side, <font color="#ffc000">child owns the FK</font>)


---

#  1️⃣ `@OneToOne` Relationship

## Example: **Student & Address**

👉 **One student has one address**

---

### 🔸 Student Entity (Owning Side)

```java
@Entity
public class Student {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
}
```

---

### 🔸 Address Entity

```java
@Entity
public class Address {

    @Id
    @GeneratedValue
    private Long id;

    private String street;
    private String city;
}
```

---

### 🗃️ Database Tables

#### Student Table

| id  | name | address_id |
| --- | ---- | ---------- |
| 1   | Raj  | 101        |

#### Address Table

| id  | street  | city   |
| --- | ------- | ------ |
| 101 | MG Road | Mumbai |

📌 **Foreign key (`address_id`) is in Student table**  
👉 So **Student is the owning side**

---

# 2️⃣ `@ManyToOne` Relationship

## Example: **Student → School**

👉 **Many students belong to one school**

---

### 🔸 Student Entity (Owning Side)

```java
@Entity
public class Student {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;
}
```

---

### 🔸 School Entity

```java
@Entity
public class School {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
```

---

### 🗃️ Database Tables

#### School Table

|id|name|
|---|---|
|1|ABC High School|

#### Student Table

|id|name|school_id|
|---|---|---|
|1|Anil|1|
|2|Riya|1|

📌 **Foreign key is always on MANY side**  
👉 `@ManyToOne` is **ALWAYS owning side**

---

#  3️⃣ `@OneToMany` Relationship

## Example: **School → Students**

👉 **One school has many students**

---

### 🔸 School Entity (Inverse Side)

```java
@Entity
public class School {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL)
    private List<Student> students = new ArrayList<>();
}
```

---

### 🔸 Student Entity (Owning Side)

```java
@Entity
public class Student {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;
}
```

📌 **No foreign key in School table**  
📌 `mappedBy = "school"` → refers to variable name in Student

---

# 4️⃣ `@ManyToMany` Relationship

## Example: **Students & Courses**

👉 **A student can take many courses**  
👉 **A course can have many students**

---

### 🔸 Student Entity (Owning Side)

```java
@Entity
public class Student {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses = new ArrayList<>();
}
```

---

### 🔸 Course Entity (Inverse Side)

```java
@Entity
public class Course {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students = new ArrayList<>();
}
```

---

### 🗃️ Database Tables

#### Student Table

| id  | name   |
| --- | ------ |
| 1   | Aarti  |
| 2   | Sameer |

#### Course Table

| id  | title        |
| --- | ------------ |
| 101 | Math         |
| 102 | Computer Sci |

#### Student_Course Table

| student_id | course_id |
| ---------- | --------- |
| 1          | 101       |
| 1          | 102       |
| 2          | 101       |

📌 Join table is **mandatory** for `@ManyToMany`

---

# 🧠 CORE CONCEPTS

---

## 🔹 `@JoinColumn`

### 👉 Meaning

> Defines **where the foreign key column is stored**

```java
@JoinColumn(name = "school_id")
```

📌 Creates:

```
student.school_id → school.id
```

✅ Used in:

- `@ManyToOne`
    
- `@OneToOne`
    
- Owning side only
    

---

## 🔹 `@JoinTable`

### 👉 Meaning

> Creates a **separate table** to manage relationship

Used when:

- Both sides are MANY
    
- Foreign key cannot exist in one table
    

```java
@JoinTable(
  name = "student_course",
  joinColumns = @JoinColumn(name = "student_id"),
  inverseJoinColumns = @JoinColumn(name = "course_id")
)
```

✅ Used only in `@ManyToMany`

---

## 🔹 `mappedBy`

### 👉 Meaning

> <font color="#ffc000">“I am NOT the owner. Other side manages the FK.”</font>

```java
@OneToMany(mappedBy = "school")
```

📌 Rules:

- `mappedBy` value = **variable name**
    
- Used on **inverse side**
    
- Prevents extra join table
    

---

# 🧠 Owning Side Summary 

| Relationship  | Owning Side               |
| ------------- | ------------------------- |
| `@ManyToOne`  | Always owning             |
| `@OneToMany`  | Inverse (uses `mappedBy`) |
| `@OneToOne`   | Side with `@JoinColumn`   |
| `@ManyToMany` | Side with `@JoinTable`    |

---


# 🧠 Fetch & Cascade

---

## 🔹 FetchType

### 👉 Meaning

> Defines **when related entities should be loaded from the database**

JPA provides two fetch strategies:

- `FetchType.LAZY`
    
- `FetchType.EAGER`
    

---

### `FetchType.LAZY` vs `FetchType.EAGER`

|                  | LAZY                           | EAGER                                      |
| ---------------- | ------------------------------ | ------------------------------------------ |
| Loads data       | Only when you access the field | Always, even if you don't need it          |
| Performance      | Better for production          | Can cause N+1 and memory issues            |
| Default for      | `@OneToMany`, `@ManyToMany`    | `@ManyToOne`, `@OneToOne`                  |
| When to override | Rarely                         | Almost never — use JPQL JOIN FETCH instead |

---

### Default JPA Behavior

#### 📌 To-Many Relationships → LAZY

```java
@OneToMany
private List<Student> students;

@ManyToMany
private List<Course> courses;
```

By default:

```java
FetchType.LAZY
```

JPA loads the parent first and fetches children only when accessed.

---

#### 📌 To-One Relationships → EAGER

```java
@ManyToOne
private School school;

@OneToOne
private Address address;
```

By default:

```java
FetchType.EAGER
```

JPA loads the related entity immediately.

---

### Production Rule

✅ Always prefer:

```java
fetch = FetchType.LAZY
```

Example:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "school_id")
private School school;
```

Instead of loading relationships automatically, fetch them explicitly when needed:

```java
SELECT s
FROM Student s
JOIN FETCH s.school
WHERE s.id = :id
```

📌 This avoids:

- N+1 query problems
    
- Unnecessary memory usage
    
- Large object graphs being loaded accidentally
    

---

## 🔹 CascadeType

### 👉 Meaning

> Tells JPA what to do to related entities when an operation is performed on the parent entity.

Example:

```java
@OneToMany(cascade = CascadeType.ALL)
private List<OrderItem> items;
```

When an operation is performed on `Order`, the same operation can automatically be applied to `OrderItem`.

---

### Cascade Types

|CascadeType|What Happens|
|---|---|
|`PERSIST`|Saving parent also saves children|
|`MERGE`|Updating parent also updates children|
|`REMOVE`|Deleting parent also deletes children|
|`REFRESH`|Refreshing parent also refreshes children|
|`DETACH`|Detaching parent also detaches children|
|`ALL`|All of the above|

---

### Example

```java
Order order = new Order();

OrderItem item1 = new OrderItem();
OrderItem item2 = new OrderItem();

order.setItems(List.of(item1, item2));

entityManager.persist(order);
```

With:

```java
cascade = CascadeType.PERSIST
```

JPA automatically saves:

```text
Order
OrderItem 1
OrderItem 2
```

No need to call:

```java
entityManager.persist(item1);
entityManager.persist(item2);
```

---

### Production Tips

#### ✅ Good Use Case

```java
@OneToMany(
    mappedBy = "order",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
private List<OrderItem> items;
```

Reason:

```text
OrderItem cannot exist without Order
```

Deleting an order should also delete its items.

---

#### ❌ Avoid on Many-to-Many

```java
@ManyToMany(cascade = CascadeType.REMOVE)
private List<Role> roles;
```

Problem:

```text
User A ── Role ADMIN
User B ── Role ADMIN
```

Deleting User A may also delete the shared `ADMIN` role.

This can break other users that reference the same role.

---

### Production Rule

✅ Use `CascadeType.ALL` only when the child entity has no meaning without the parent.

Examples:

```text
Order → OrderItem
Invoice → InvoiceLine
Cart → CartItem
```

❌ Avoid `CascadeType.REMOVE` on `@ManyToMany` relationships because entities are typically shared.

---

### Quick Memory Trick

```text
ToMany  → LAZY
ToOne   → EAGER
```

```text
FetchType = WHEN to load data
CascadeType = WHAT operation to propagate
```


---
