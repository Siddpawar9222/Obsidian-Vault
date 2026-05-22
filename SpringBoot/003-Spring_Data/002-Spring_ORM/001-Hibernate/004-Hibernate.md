
-----

# How to Configure Hibernate in a Maven Project

[Hibernate 5 Java Configuration Example](https://www.digitalocean.com/community/tutorials/jpa-hibernate-annotations)

## SessionFactory: Interface
The `SessionFactory` is a heavyweight object in Hibernate that represents a single database connection or data source configuration. It is typically instantiated once per application and is thread-safe. The `SessionFactory` is responsible for:
- Establishing and managing database connections.
- Loading Hibernate configuration settings.
- Creating and managing `Session` instances.
- Providing access to the Hibernate Transaction API.

## Session: Interface
A `Session` in Hibernate represents a single unit of work or a database transaction. It is a lightweight, short-lived object that is instantiated from the `SessionFactory` and is not thread-safe. The `Session` is responsible for:
- Performing CRUD (Create, Read, Update, Delete) operations on persistent objects.
- Managing the state of persistent objects (e.g., loading, saving, updating, deleting).
- Caching and tracking changes made to persistent objects.
- Synchronizing changes with the database during transaction commit.

## Configuration: Class
The `Configuration` object in Hibernate represents the configuration settings for Hibernate, including database connection details, entity mappings, and other options required for Hibernate to operate.

## Properties: Class
In Hibernate, `Properties` are key-value pairs used to specify configuration settings such as database connection parameters, dialect, and other Hibernate-specific options.

## ServiceRegistry: Interface
The `ServiceRegistry` in Hibernate is a central registry for managing and accessing services needed by Hibernate, such as connection pooling, transaction management, and caching. It provides a way to locate and access these services within the Hibernate framework.

# File Structure of Maven Web-Based Project

```
src
└── main
    └── webapp
        ├── WEB-INF
        │   └── web.xml
        ├── css
        │   └── styles.css
        ├── images
        │   └── logo.png
        ├── js
        │   └── script.js
        ├── jsp
        │   └── employeeForm.jsp
        └── index.jsp
```

# HQL and HCQL

- **HQL:** `session.createQuery("from Employee", Employee.class).list();`
- **HCQL (Hibernate Criteria Query Language):** [JavaTpoint - HCQL](https://www.javatpoint.com/hcql)

# Try-with-Resources

Try-with-resources is a feature introduced in Java 7 that simplifies resource management by automatically closing resources at the end of a try block. 

### Automatic Resource Management:
- Try-with-resources simplifies the management of resources that need to be closed after their use, such as file streams, database connections, network sockets, etc.
- By using try-with-resources, you can declare one or more resources within the parentheses of the try statement. These resources are automatically closed at the end of the try block, regardless of whether an exception occurs.
- The resources are closed in the reverse order of their declaration, and they are closed before any catch or finally blocks are executed.

Example:
```java
try (FileInputStream fis = new FileInputStream("example.txt")) {
    // Code to read from the file
} catch (IOException e) {
    // Exception handling
}
```

# Transactions in Hibernate

In Hibernate, <font color="#ffc000">transactions are used to group a set of operations that should be treated as a single unit of work</font>. When you use transactions with sessions, you ensure that changes made to the database are atomic, consistent, isolated, and durable (ACID properties).

### When and How Transactions are Used:
1. **Data Manipulation:**
   - Transactions are commonly used when performing operations that modify data in the database, such as saving, updating, or deleting entities.
   - For example, when you call `session.save(entity)` to persist a new entity to the database, it's typically wrapped within a transaction.

2. **Ensuring Data Consistency:**
   - Transactions help maintain data consistency by ensuring that either all the operations within the transaction are successfully committed to the database or none of them are.
   - If an error occurs during the execution of operations within a transaction, Hibernate can rollback the transaction, reverting any changes made so far, ensuring that the database remains in a consistent state.

3. **Isolation and Concurrency Control:**
   - Transactions provide isolation between concurrent database access by ensuring that changes made by one transaction are not visible to other transactions until the changes are committed.
   - Transactions can specify isolation levels to control the degree of isolation required for a particular transaction, balancing consistency and performance.

4. **Optimistic Locking:**
   - Transactions are often used in conjunction with optimistic locking mechanisms to handle concurrent updates to the same data.
   - Optimistic locking relies on versioning or timestamps to detect conflicting updates, and transactions are used to encapsulate the check and update operations.

5. **Error Handling and Rollback:**
   - Transactions help manage error handling and rollback operations in case of exceptions or errors during database operations.
   - If an exception occurs within a transaction, Hibernate can automatically rollback the transaction to ensure that the database is not left in an inconsistent state.


# Single Session and Multiple Transactions

In Hibernate, <font color="#ffc000">a single session can have multiple transactions, but only one transaction can be active at a time.</font>

### How It Typically Works:
1. **Single Transaction at a Time:**
   - Hibernate enforces a single transaction per session at any given moment.
   - Once a transaction is started on a session, it must be completed (committed or rolled back) before another transaction can be started.

2. **Transaction Lifecycle:**
   - You can start a transaction on a session using `session.beginTransaction()`. This marks the beginning of the transactional context for that session.
   - Within the transaction, you can perform various database operations like saving, updating, or deleting entities.
   - Once the transaction is completed (either committed or rolled back), the session returns to a non-transactional state.
   - After completing a transaction, you can start a new transaction on the same session if needed.

3. **Nested Transactions:**
   - Hibernate does not support true nested transactions. Each transaction is treated independently within its session.
   - However, you can achieve a similar effect by using savepoints, which allow you to mark a point within a transaction to which you can later roll back if needed. Hibernate supports this through JDBC savepoints.

4. **Transaction Management:**
   - It's essential to properly manage transactions to ensure data consistency and integrity.
   - Always commit transactions after successful completion of database operations to persist changes permanently.
   - If an error occurs during the transaction, ensure that it's rolled back to maintain data consistency and avoid leaving the database in an inconsistent state.

When using the `@Transactional` annotation in Spring, you typically don't need to write explicit transaction management logic.

# How to Deploy a .war File on Tomcat

[How to Deploy a .war File in Tomcat 7](https://stackoverflow.com/questions/5109112/how-to-deploy-a-war-file-in-tomcat-7)

---