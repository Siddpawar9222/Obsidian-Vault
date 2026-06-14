



----


# Evolution of Java Persistence: JDBC → Hibernate → JPA

## Timeline

```text
JDBC (1997)
    ↓
Hibernate (2001)
    ↓
JPA (2006)
```

---

## JDBC

<font color="#ffc000">JDBC (Java Database Connectivity) is a Java API that allows applications to communicate directly with relational databases using SQL.</font>

### Problem with JDBC

In the early days, Java developers used JDBC directly.

```java
Connection con = DriverManager.getConnection(...);

PreparedStatement ps =
    con.prepareStatement(
        "SELECT * FROM student"
    );

ResultSet rs = ps.executeQuery();
```

Developers quickly realized:

- Too much boilerplate code
    
- Manual object mapping
    
- Hard to maintain large applications
    
- SQL scattered throughout the codebase
    

---

## Hibernate

<font color="#ffc000">Hibernate is an ORM (Object Relational Mapping) framework that maps Java objects to relational database tables and automatically generates SQL for database operations.</font>

### Why Hibernate Was Created

To avoid writing repetitive JDBC code and manual object mapping.

Instead of:

```java
SELECT * FROM student WHERE id = ?
```

developers could write:

```java
Student student =
        session.get(Student.class, 1L);
```

Hibernate became extremely popular because it allowed developers to work with Java objects instead of SQL.

### The New Problem

Many ORM frameworks appeared:

- Hibernate
    
- TopLink
    
- JDO
    
- iBatis (later MyBatis)
    

Each framework had its own APIs.

Example:

Hibernate:

```java
Session session =
        sessionFactory.openSession();
```

TopLink:

```java
TopLinkSession session = ...
```

Switching ORM providers required significant code changes.

---

## JPA

<font color="#ffc000">JPA (Java Persistence API) is a Java specification that defines a standard set of interfaces, annotations, and rules for interacting with relational databases using Java objects.</font>

### Why JPA Was Created

The Java community wanted a common standard so applications would not depend on a specific ORM framework.

Think of JPA as:

```text
A common language for all ORM frameworks.
```

Instead of provider-specific APIs:

```java
Session session = ...
```

developers write:

```java
EntityManager entityManager = ...
```

Instead of provider-specific annotations:

```java
@org.hibernate.annotations.Entity
```

developers use:

```java
@Entity
```

Now application code depends on JPA rather than a specific ORM implementation.

---

## Hibernate After JPA

Hibernate already existed before JPA.

After JPA was introduced, Hibernate implemented the JPA specification and became a JPA Provider.

Hibernate added support for:

```java
@Entity
@Id
@OneToMany
EntityManager
```

Today Hibernate is the most widely used JPA implementation.

---

## Why Spring Boot Uses JPA APIs

Spring Boot avoids coupling applications directly to Hibernate.

Developers write:

```java
@Entity
public class Student {
}
```

```java
public interface StudentRepository
        extends JpaRepository<Student, Long> {
}
```

Concepts such as:

```text
@Entity
EntityManager
JpaRepository
```

belong to JPA.

At runtime:

```text
Spring Boot
    ↓
Spring Data JPA
    ↓
JPA APIs
    ↓
Hibernate (Implementation)
    ↓
JDBC
    ↓
Database
```

Hibernate performs the actual database operations.

---

## Quick Revision

### JDBC

```text
Java API for executing SQL directly against relational databases.
```

### ORM

```text
Technique that maps Java objects to relational database tables.
```

### Hibernate

```text
ORM framework and the most popular implementation of JPA.
```

### JPA

```text
Java specification that standardizes persistence APIs for relational databases.
```

### Spring Data JPA

```text
Spring abstraction built on top of JPA that simplifies repository creation and database access.
```


### Spring ORM

```text
Spring ORM is a Spring module that helps ORM frameworks work smoothly inside the Spring ecosystem.
```
---

