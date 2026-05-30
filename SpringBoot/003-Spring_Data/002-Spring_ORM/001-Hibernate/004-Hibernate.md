
-----

# How to Configure Hibernate in a Maven Project

## SessionFactory: Interface

The `SessionFactory` is a heavyweight, thread-safe Hibernate object responsible for managing Hibernate’s overall persistence configuration and creating `Session` objects.

It is typically created once per database configuration in an application.

### Responsibilities of SessionFactory

* Loading Hibernate configuration settings.
* Managing entity metadata and mappings.
* Integrating with datasource/connection pools.
* Creating and managing `Session` instances.
* Managing second-level cache configuration.
* Providing Hibernate infrastructure services.

### Important Notes

* `SessionFactory` does NOT represent a single database connection.
* It internally uses database connections from a connection pool.
* Creating a `SessionFactory` is expensive because Hibernate performs:

  * Entity scanning
  * Metadata parsing
  * Cache initialization
  * SQL strategy preparation

Because of this, applications usually create only one `SessionFactory` per database.

---

# Session: Interface

A `Session` in Hibernate represents a single persistence context and acts as the primary interface for interacting with the database.

It is a lightweight, short-lived, and non-thread-safe object created by the `SessionFactory`.

### Responsibilities of Session

* Performing CRUD operations on entities.
* Managing entity lifecycle states.
* Tracking changes using dirty checking.
* Managing the first-level cache.
* Synchronizing changes with the database during flush/commit operations.

### Important Notes

* A `Session` is usually opened per request or per transaction.
* It should always be closed after use.
* One session can contain multiple transactions, but only one transaction can be active at a time.

---

# Configuration: Class

The `Configuration` class in Hibernate is used to configure Hibernate settings and register entity mappings before creating the `SessionFactory`.

It loads:

* Database connection settings
* Hibernate properties
* Entity mapping configurations
* Caching settings
* Dialect configuration

Example:

```java
Configuration configuration = new Configuration();
configuration.configure("hibernate.cfg.xml");
```

---

# Properties: Class

`Properties` in Hibernate are key-value configuration settings used to define Hibernate behavior.

Examples include:

* Database URL
* Username/password
* Hibernate dialect
* SQL logging
* DDL auto settings
* Cache configuration

Example:

```properties
hibernate.dialect=org.hibernate.dialect.MySQLDialect
hibernate.show_sql=true
```

---

# ServiceRegistry: Interface

`ServiceRegistry` is Hibernate’s internal service container used to manage and provide Hibernate services.

It helps Hibernate access services like:

* Connection management
* Transaction management
* Caching
* JDBC services
* Event handling

It acts similarly to a dependency injection container inside Hibernate.

Example:

```java
ServiceRegistry serviceRegistry =
    new StandardServiceRegistryBuilder()
        .applySettings(configuration.getProperties())
        .build();
```

---

# File Structure of Maven Web-Based Project

```text
src
└── main
    ├── java
    ├── resources
    └── webapp
        ├── WEB-INF
        │   └── web.xml
        ├── css
        ├── images
        ├── js
        ├── jsp
        └── index.jsp
```

### Important Correction

In a Maven project:

* Java source files are stored inside:

```text
src/main/java
```

* Configuration files are usually stored inside:

```text
src/main/resources
```

---

# HQL and Criteria API

## HQL (Hibernate Query Language)

HQL is an object-oriented query language provided by Hibernate.

It works with entity classes instead of database tables.

Example:

```java
session.createQuery(
    "from Employee",
    Employee.class
).list();
```

---

## Criteria API

The old term “HCQL” is outdated and not commonly used in industry.

Modern Hibernate applications use:

* JPA Criteria API

It provides type-safe dynamic query building.

Example use cases:

* Dynamic filters
* Search screens
* Complex query generation

---

# Try-with-Resources

Try-with-resources is a Java feature introduced in Java 7 for automatic resource management.

Resources declared inside the `try()` block are automatically closed.

Example:

```java
try (FileInputStream fis =
         new FileInputStream("example.txt")) {

    // read file

} catch (IOException e) {

}
```

### Benefits

* Prevents resource leaks
* Reduces boilerplate code
* Automatically closes resources

---

# Transactions in Hibernate

Transactions group multiple database operations into a single unit of work.

Hibernate transactions help maintain ACID properties:

* Atomicity
* Consistency
* Isolation
* Durability

### Why Transactions are Important

* Ensures data consistency
* Supports rollback during failures
* Handles concurrent access safely
* Maintains database integrity

---

# Common Transaction Flow

```java
Transaction tx = null;

try {
    tx = session.beginTransaction();

    session.save(employee);

    tx.commit();

} catch (Exception e) {

    if (tx != null) {
        tx.rollback();
    }
}
```

---

# Single Session and Multiple Transactions

A single Hibernate `Session` can contain multiple transactions, but only one transaction can be active at a time.

### Lifecycle

```text
Open Session
    ↓
Start Transaction
    ↓
DB Operations
    ↓
Commit/Rollback
    ↓
Start Another Transaction
    ↓
Close Session
```

### Important Notes

* Hibernate does not support true nested transactions.
* JDBC savepoints can be used for partial rollback behavior.
* In Spring Boot applications, transaction management is usually handled using `@Transactional`.

---

# Spring Transaction Management

In Spring applications, transactions are usually managed declaratively using:

```java
@Transactional
```

Spring internally handles:

* Transaction creation
* Commit
* Rollback
* Exception handling

This reduces boilerplate transaction code.

---

# How to Deploy a WAR File on Tomcat

A `.war` file is a packaged Java web application.

Steps:

* Build the WAR file using Maven:

```bash
mvn clean package
```

* Copy the WAR file into Tomcat’s:

```text
webapps/
```

directory.

* Start Tomcat server.

Tomcat automatically extracts and deploys the application.

---

[Hibernate 5 Java Example](https://www.digitalocean.com/community/tutorials/jpa-hibernate-annotations)


[Hibernate 5 Java Configuration Example](https://github.com/Siddpawar9222/BlueBricks-Assessment/blob/master/employee-management-system/src/main/java/com/bluebricks/util/HibernateUtil.java)


---