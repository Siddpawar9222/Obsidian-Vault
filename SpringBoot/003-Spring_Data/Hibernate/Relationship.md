
---

## 🔗 Types of Relationships in JPA

| Relationship  | Meaning                                       |
| ------------- | --------------------------------------------- |
| `@OneToOne`   | One entity has **exactly one** related entity |
| `@OneToMany`  | One entity has **many** related entities      |
| `@ManyToOne`  | Many entities are related to **one** entity   |
| `@ManyToMany` | Many entities related to **many** entities    |

---

## ✅ 1. `@OneToOne` – Example: Person & Passport

> One person has one passport.

### 🔸 Entity: `Person`

```java
@Entity
public class Person {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "passport_id")
    private Passport passport;
}
```

### 🔸 Entity: `Passport`

```java
@Entity
public class Passport {
    @Id
    @GeneratedValue
    private Long id;

    private String passportNumber;
}
```

---

## ✅ 2. `@OneToMany` and `@ManyToOne` – Example: School & Students

> One school has many students, but each student belongs to one school.

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

---

## ✅ 3. `@ManyToMany` – Example: Students & Courses

> A student can join many courses, and a course can have many students.

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

    private String courseName;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students = new ArrayList<>();
}
```

---

## 🔁 Important Annotations

|Annotation|Purpose|
|---|---|
|`@OneToOne`|Defines one-to-one relationship|
|`@OneToMany`|One to many, placed on parent entity|
|`@ManyToOne`|Many to one, placed on child entity|
|`@ManyToMany`|Many-to-many mapping|
|`@JoinColumn`|Specifies the foreign key column|
|`@JoinTable`|For many-to-many join table|
|`mappedBy`|Inverse side of relationship (non-owning)|

---

## 🧠 Real-World Summary

- `@OneToOne` → Person - Passport
    
- `@OneToMany`/`@ManyToOne` → School - Students
    
- `@ManyToMany` → Students - Courses
    

---
