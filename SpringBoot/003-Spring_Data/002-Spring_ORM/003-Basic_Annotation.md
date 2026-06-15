
---

[JPA Annotations](https://www.digitalocean.com/community/tutorials/jpa-hibernate-annotations)

----


```text
Entity Mapping
    ↓
Primary Key Mapping
    ↓
Column Mapping
    ↓
Relationship Mapping
    ↓
Fetching & Cascading
    ↓
Inheritance
    ↓
Lifecycle Events
    ↓
Query Related
```

---

# Entity Mapping Annotations

## @Entity

Marks a class as a JPA entity.

```java
@Entity
public class Student {
}
```

Without `@Entity`, Hibernate ignores the class.

### Internally

When Spring Boot starts:

```text
Entity Scan
    ↓
Find @Entity classes
    ↓
Create metadata
    ↓
Map class ↔ table
```

---

## @Table

Maps entity to a specific table.

```java
@Entity
@Table(name = "students")
public class Student {
}
```

Without it:

```text
Student
   ↓
student table (default naming strategy)
```

With it:

```text
Student
   ↓
students table
```

---

# Primary Key Annotations

## @Id

Marks primary key.

```java
@Id
private Long id;
```

---

## @GeneratedValue

Auto-generates IDs.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

---

### GenerationType.IDENTITY

Database generates ID.

```sql
id BIGSERIAL PRIMARY KEY
```

Insert:

```sql
INSERT INTO student(name)
VALUES('John');
```

Database:

```text
id = 1
```

---

### GenerationType.SEQUENCE

Uses database sequence.

```java
@GeneratedValue(strategy = GenerationType.SEQUENCE)
```

Before insert:

```sql
SELECT nextval('student_seq');
```

Then:

```sql
INSERT INTO student(id,name)
VALUES(1,'John');
```

Preferred for PostgreSQL.

---

### GenerationType.AUTO

Hibernate decides.

```java
@GeneratedValue(strategy = GenerationType.AUTO)
```

---

## @SequenceGenerator

Custom sequence.

```java
@SequenceGenerator(
    name = "student_seq",
    sequenceName = "student_seq",
    allocationSize = 1
)
```

```java
@Id
@GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "student_seq"
)
private Long id;
```

---

# Column Mapping

## @Column

Maps field to column.

```java
@Column(name = "student_name")
private String name;
```

---

### Common Attributes

#### nullable

```java
@Column(nullable = false)
```

Creates:

```sql
NOT NULL
```

---

#### unique

```java
@Column(unique = true)
```

Creates:

```sql
UNIQUE
```

---

#### length

```java
@Column(length = 100)
```

Creates:

```sql
VARCHAR(100)
```

---

#### updatable

```java
@Column(updatable = false)
```

Cannot be updated.

Useful for:

```java
createdAt
```

---

#### insertable

```java
@Column(insertable = false)
```

Hibernate skips during insert.

---

# Large Data

## @Lob

Large Object.

```java
@Lob
private String description;
```

Stored as:

```text
TEXT
```

or

```text
CLOB
```

---

## @Transient

Ignore field.

```java
@Transient
private int age;
```

Not persisted.

---

# Date and Time

## @Temporal

Used with old Date API.

```java
@Temporal(TemporalType.DATE)
private Date dob;
```

Nowadays use Java 8 types.

```java
LocalDate
LocalDateTime
Instant
```

No need for `@Temporal`.

---

# Enumerations

## @Enumerated

### ORDINAL

```java
@Enumerated(EnumType.ORDINAL)
private Status status;
```

```text
OPEN = 0
CLOSED = 1
```

Dangerous.

---

### STRING

```java
@Enumerated(EnumType.STRING)
private Status status;
```

Stored:

```text
OPEN
CLOSED
```

Industry standard.

---

# Relationship Mapping

Most important topic in JPA.

---

## @OneToOne

Example:

```text
User
   ↔
Passport
```

```java
@OneToOne
@JoinColumn(name = "passport_id")
private Passport passport;
```

Database:

```sql
user
-----
id
passport_id
```

---

## @OneToMany

Example:

```text
Classroom
    ↓
Many Students
```

```java
@OneToMany(mappedBy = "classroom")
private List<Student> students;
```

---

## @ManyToOne

```java
@ManyToOne
@JoinColumn(name = "classroom_id")
private Classroom classroom;
```

Database:

```sql
student
--------
id
classroom_id
```

Most commonly used relationship.

---

## @ManyToMany

Example:

```text
Student
    ↔
Course
```

```java
@ManyToMany
@JoinTable(
    name = "student_course",
    joinColumns = @JoinColumn(name="student_id"),
    inverseJoinColumns = @JoinColumn(name="course_id")
)
```

Creates:

```sql
student_course
--------------
student_id
course_id
```

---

# Foreign Key Annotation

## @JoinColumn

Specifies FK column.

```java
@ManyToOne
@JoinColumn(name = "department_id")
private Department department;
```

Without it:

```text
department_id generated automatically
```

---

# Fetching

## FetchType.LAZY

Data loaded only when accessed.

```java
@OneToMany(fetch = FetchType.LAZY)
```

```java
student.getCourses()
```

Then query fires.

---

## FetchType.EAGER

Loads immediately.

```java
@OneToOne(fetch = FetchType.EAGER)
```

```text
Student Query
     +
Course Query
```

Can create N+1 problems.

---

### Industry Rule

```text
Always prefer LAZY
```

unless strong reason exists.

---

# Cascade Operations

## CascadeType.PERSIST

```java
cascade = CascadeType.PERSIST
```

Save parent:

```java
departmentRepository.save(department);
```

Child entities also saved.

---

## CascadeType.REMOVE

Delete parent:

```java
departmentRepository.delete(department);
```

Children deleted.

---

## CascadeType.ALL

```java
cascade = CascadeType.ALL
```

Includes:

```text
PERSIST
MERGE
REMOVE
REFRESH
DETACH
```

Use carefully.

---

# Orphan Removal

## orphanRemoval

```java
@OneToMany(
    mappedBy = "department",
    orphanRemoval = true
)
```

Remove child from collection:

```java
department.getEmployees().remove(emp);
```

Hibernate:

```sql
DELETE FROM employee
```

---

# Embedded Objects

## @Embeddable

Reusable object.

```java
@Embeddable
public class Address {
}
```

---

## @Embedded

```java
@Embedded
private Address address;
```

Table:

```sql
student
--------
city
state
country
```

No separate table.

---

# Inheritance Mapping

## @Inheritance

### SINGLE_TABLE

```java
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
```

```text
Vehicle
Car
Bike
```

One table.

Fastest.

---

### JOINED

```java
@Inheritance(strategy = InheritanceType.JOINED)
```

Separate tables.

```text
vehicle
car
bike
```

Most normalized.

---

### TABLE_PER_CLASS

Separate table per class.

Rarely used.

---

# Lifecycle Callbacks

## @PrePersist

Before insert.

```java
@PrePersist
public void beforeInsert() {
    createdAt = Instant.now();
}
```

---

## @PostPersist

After insert.

```java
@PostPersist
```

---

## @PreUpdate

Before update.

```java
@PreUpdate
```

---

## @PostUpdate

After update.

```java
@PostUpdate
```

---

## @PreRemove

Before delete.

```java
@PreRemove
```

---

## @PostRemove

After delete.

```java
@PostRemove
```

---

# Versioning

## @Version

Optimistic Locking.

```java
@Version
private Long version;
```

Database:

```text
id | name | version
-------------------
1  | John | 5
```

Prevents lost updates.

Very important in enterprise applications.

---

# Query Related

## @NamedQuery

```java
@NamedQuery(
    name = "Student.findAll",
    query = "SELECT s FROM Student s"
)
```

Reusable JPQL query.

---

# Most Used Annotations in Real Projects

In a Spring Boot enterprise application (Ticketing System, LMS, E-Commerce, Banking), you'll use these 90% of the time:

```java
@Entity
@Table

@Id
@GeneratedValue

@Column

@Enumerated

@OneToMany
@ManyToOne

@OneToOne

@JoinColumn

@CreationTimestamp
@UpdateTimestamp

@Version

@Transactional   // Spring, not JPA
```

For your LMS and Ticket Management projects, mastering these annotations deeply is more valuable than memorizing every JPA annotation. Understanding **owning side vs inverse side**, **mappedBy**, **fetch types**, **cascade types**, and **Hibernate's SQL generation** is where most interview and real-world complexity lies.

---

| `@Lob`        | Large text / binary |
| ------------- | ------------------- |
| `@Column`     | Column control      |
| `@Transient`  | Not stored in DB    |
| `@Enumerated` | Enum storage        |
| `@Temporal`   | Date handling       |
| `@Convert`    | Custom conversion   |
| `@Embedded`   | Group fields        |
| Annotation    | Purpose             |
| `@Basic`      | Default mapping     |


---

