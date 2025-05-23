
---

## 🔗 Types of Relationships in JPA

| Relationship  | Meaning                                       |
| ------------- | --------------------------------------------- |
| `@OneToOne`   | One entity has **exactly one** related entity |
| `@OneToMany`  | One entity has **many** related entities      |
| `@ManyToOne`  | Many entities are related to **one** entity   |
| `@ManyToMany` | Many entities related to **many** entities    |

---

## ✅ 1. `@OneToOne` – **Student & Address**

> One student has one address.

### 🔸 Entity: `Student`

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

### 🔸 Entity: `Address`

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

### 🗃️ Database Tables and Dummy Data

**Student Table**

|id|name|address_id|
|---|---|---|
|1|Raj|101|

**Address Table**

|id|street|city|
|---|---|---|
|101|MG Road|Mumbai|

---

## ✅ 2. `@OneToMany` and `@ManyToOne` – **School & Students**

> One school has many students.

### 🔸 Entity: `School`

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

### 🔸 Entity: `Student`

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

### 🗃️ Database Tables and Dummy Data

**School Table**

|id|name|
|---|---|
|1|ABC High School|

**Student Table**

|id|name|school_id|
|---|---|---|
|1|Anil|1|
|2|Riya|1|

---

## ✅ 3. `@ManyToMany` – **Students & Courses**

> Students can take multiple courses and vice versa.

### 🔸 Entity: `Student`

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

### 🔸 Entity: `Course`

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

### 🗃️ Database Tables and Dummy Data

**Student Table**

|id|name|
|---|---|
|1|Aarti|
|2|Sameer|

**Course Table**

|id|title|
|---|---|
|101|Math|
|102|Computer Sci|

**Student_Course Join Table**

|student_id|course_id|
|---|---|
|1|101|
|1|102|
|2|101|

---

## 🔁 Important Annotations

| Annotation    | Purpose                                   |
| ------------- | ----------------------------------------- |
| `@OneToOne`   | Defines one-to-one relationship           |
| `@OneToMany`  | One to many, placed on parent entity      |
| `@ManyToOne`  | Many to one, placed on child entity       |
| `@ManyToMany` | Many-to-many mapping                      |
| `@JoinColumn` | Specifies the foreign key column          |
| `@JoinTable`  | For many-to-many join table               |
| `mappedBy`    | Inverse side of relationship (non-owning) |

---
