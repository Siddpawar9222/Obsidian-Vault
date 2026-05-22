
---

# 🔗 Types of Relationships in JPA (Complete Notes)

In JPA, **relationships define how tables are connected using foreign keys**.

---

## 📌 Relationship Types Overview

|Relationship|Meaning|Real-World Example|
|---|---|---|
|`@OneToOne`|One entity → exactly one entity|Student ↔ Address|
|`@OneToMany`|One entity → many entities|School → Students|
|`@ManyToOne`|Many entities → one entity|Students → School|
|`@ManyToMany`|Many entities → many entities|Students ↔ Courses|

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

# 🧠 CORE CONCEPTS (VERY IMPORTANT)

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

> “I am NOT the owner. Other side manages the FK.”

```java
@OneToMany(mappedBy = "school")
```

📌 Rules:

- `mappedBy` value = **variable name**
    
- Used on **inverse side**
    
- Prevents extra join table
    

---

# 🧠 Owning Side Summary (Interview Gold)

|Relationship|Owning Side|
|---|---|
|`@ManyToOne`|Always owning|
|`@OneToMany`|Inverse (uses `mappedBy`)|
|`@OneToOne`|Side with `@JoinColumn`|
|`@ManyToMany`|Side with `@JoinTable`|

---
